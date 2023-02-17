/*********************************
  LPAQ1 2022.7.30
**********************************
based on Matt Mahoney's lpaq1.
It is a context-mixing compressor combining 7 contexts: orders 1, 2, 3, 4, 6, a lowercase unigram word context(for ASCII text), and a "match" order, which predicts the next bit in the last matching context. The independent bit predictions of the 7 models are combined using one of 80 neural networks(selected by a small context), then adjusted using 2 SSE stages(order 0 and 1) and arithmetic coded.

usage:
LPAQ1e(A,m,done,rate): compressor
@A: input(Array / Uint8Array)
@m: memory usage(0-15)
@done: call back of last process.
  done(A)
  @A: compressed array of input.
  e.g, console.log(A)
@rate: call back of progress
  rate(a,z)
  @a: current position
  @z: last position
  e.g, console.log(a/z,"%")

LPAQ1d(A,done,rate): decompressor
@A: input(Array / Uint8Array)
@done: call back of last process.
  done(A)
  @A: compressed array of input.
  e.g, console.log(A)
@rate: call back of progress
  rate(a,z)
  @a: current position
  @z: last position
  e.g, console.log(a/z,"%")
**********************************/
var ST = function (i, j, u, t, s, c) { for (t[0] = 1; c = s[u](i++);)t[++j] = c ^ 1 ? c : s[u](i++) + 126; return t }(0, 0, "charCodeAt", new Uint8Array(512), `\n	\r! # # # #"%"%"%"%"%"%$'$'$'$'&()+*-*-,/,/.1.10303245+69698;8;:=:=<?<?>A>A2BC7D9D9FIFIHKHKJMJMLOLO>Q>Q@RSETGTGVIVI,;,;:=:=<1<1LYLYN[N[P\\]E^W^W\`-\`-0c0cXeXePfgEhWhWj9j9>m>mXoXoPpqUrWrWt9t9>w>wXyXyZz{U|a|a~9~9>>bbZUaa\n9\n9>\r>\rbbZ_aaD9D9>Q>Qbbd_kklld_kld_ kl!d"#i$kl%n&'i(uv)n*+i,uv-n./i0uv1n23i4uv5n67s8uv9x:;s<=x>?s@AxBCsDExFGsHIxJKsLMxNOsPQxRS}TUVW}XYZ[}\\]^_}\`abc}defg}hijk}lmno}pqrs}tuvw	xyz{	|EP}~{	|EP}~`),
  SQ = new Uint16Array([1, 2, 3, 6, 10, 16, 27, 45, 73, 120, 194, 310, 488, 747, 1101, 1546, 2047, 2549, 2994, 3348, 3607, 3785, 3901, 3975, 4022, 4050, 4068, 4079, 4085, 4089, 4092, 4093, 4094]),
  DT = function (A, i) { for (; i;)A[--i] = 16384 / (i + i + 3) | 0; return A }(new Int16Array(1024), 1024),
  stretch = function (A, x, p, i) {
    for (; ++x < 2048;)
      for (i = squash(x); p <= i;)A[p++] = x;
    A[4095] = 2047; return A
  }(new Int16Array(4096), -2048, 0);

function squash(d, w) {
  if (d > 2047) return 4095;
  if (d < -2047) return 0;
  return SQ[w = (d >> 7) + 16] * (128 - (d &= 127)) + SQ[++w] * d + 64 >> 7
}

//////////////////////////// StateMap, APM //////////////////////////
function StateMap(i) { for (var A = new Uint32Array(i); i;)A[--i] = 1 << 31; A.cxt = 0; return A }
function APM(n) {
  for (var A = new Uint32Array(n *= 24), i = 24, p = i; i;)A[--i] = squash(((i * 2 + 1 << 12) / 48 | 0) - 2048) << 20 | 6;
  for (A.cxt = 0; p < n;)A[p++] = A[i++];
  return A
}
function SMup(A, y, limit) {
  var c = A.cxt, i = A[c], n = i & 1023, p = i >>> 10;
  A[c] += ((y << 22) - p >> 3) * DT[n] & -1024 | n < limit
}
function SMp(A, y, cx) {
  SMup(A, y, 1023);
  return A[A.cxt = cx] >>> 20
}
function SMpp(A, y, pr, cx) {
  SMup(A, y, 255),
    pr = (stretch[pr] + 2048) * 23,
    cx = cx * 24 + (pr >> 12),
    A.cxt = cx + ((pr &= 4095) >> 11);
  return (A[cx] >>> 13) * (4096 - pr) + (A[cx + 1] >>> 13) * pr >> 19
}
/////////////////////////// Mixer /////////////////////////////
function Mixer() {
  var A = new Int32Array(567); A.cxt = 0; A.pr = 2048; return A
}
function MixUp(M, y) {
  var e = ((y << 12) - M.pr) * 7, i = 7;
  for (y = M.cxt * 7 + 14; i;)M[--y] += M[--i] * e + 32768 >> 16
}
function Mixp(M) {
  for (var i = 7, s = 0, c = M.cxt * 7 + 14; i;)s += M[--i] * M[--c];
  return M.pr = squash(s >> 16)
}
/////////////////////////// MatchModel ////////////////////////
function MatchModel(n) {
  this.buf = new Uint8Array(n >>= 1); this.N = n - 1;
  this.H = new Int32Array(n >>= 2); this.HN = n - 1;
  this.sm = StateMap(14336)
}
MatchModel.prototype = {
  pos: 0, mp: 0, len: 0, h1: 0, h2: 0, c0: 1, bc: 0, MAXLEN: 62,

  p: function (y, M) {
    var B = this.buf, c = this.c0 += this.c0 + y, l = this.len, m = this.mp, p = this.pos, i;
    if (++this.bc > 7) {
      this.bc = 0;
      this.h1 = this.h1 * 24 + c & this.HN;
      this.h2 = this.h2 * 160 + c & this.HN;
      B[p++] = c & 255;
      c = this.c0 = 1, p &= this.N;
      if (l) m = ++m & this.N, l < this.MAXLEN && ++l;
      else {
        m = this.H[this.h1];
        if (m ^ p) for (; l < this.MAXLEN && (i = ~l + m & this.N) ^ p && B[i] === B[~l + p & this.N];)++l
      }
      if (l < 2) {
        m = this.H[this.h2]; l = 0;
        if (m ^ p) for (; l < this.MAXLEN && (i = ~l + m & this.N) ^ p && B[i] === B[~l + p & this.N];)++l
      }
      this.H[this.h1] = this.H[this.h2] = this.pos = p; this.mp = m
    }
    if (l && (B[m] + 256 >> 8 - this.bc) === c) {
      m = B[m] >> 7 - this.bc & 1;
      if (l < 16) c = l * 2 + m;
      else c = (l >> 2) * 2 + m + 24;
      c = c << 8 | B[p - 1 & this.N]
    }
    else l = 0;
    M[0] = stretch[SMp(this.sm, y, c)];
    return this.len = l
  }
};

///////////////////////////// Predictor /////////////////////////
function Predictor(m) {
  this.a1 = APM(256), this.a2 = APM(16384), this.m = Mixer(), this.mm = new MatchModel(m = 1 << 16 + (m & 15));
  this.h = new Uint32Array(6); this.N = m *= 2;
  this.t0 = new Uint8Array(m + 65536);
  this.t = this.t0.subarray(65536); this.sm = [];
  for (m = 6; m;)this.sm[--m] = StateMap(256)
}
Predictor.prototype = {
  cp0: 0, cp1: 0, cp2: 0, cp3: 0, cp4: 0, cp5: 0, pr: 2048, bc: 0, c0: 1, c4: 0,
  x: function (i) {
    i = ((i >>> 16) * 52503 + (i &= 65535) * 1883 << 16) + i * 52503; i = i << 16 | i >>> 16;
    i = ((i >>> 16) * 14547 + (i &= 65535) * 3579 << 16) + i * 14547 >>> 0;
    var B = 16, t = this.t, c = i >>> 24, j = i = i * B & this.N - B;
    if (t[i] === c) return i;
    if (t[i ^ B] === c) return i ^ B;
    if (t[i ^ B * 2] === c) return i ^ B * 2;
    if (t[i + 1] > t[i + 1 ^ B] || t[i + 1] > t[i + 1 ^ B * 2]) i ^= B;
    if (t[i + 1] > t[i + 1 ^ B ^ B * 2]) i ^= B ^ B * 2;
    for (j = i; B--;)t[j++] = 0; t[i] = c;
    return i
  },
  update: function (y) {
    var T = this.t0, c = this.c0 += this.c0 + y, h = this.h, m = this.m, sm = this.sm, s = stretch, i;
    T[this.cp0] = ST[T[this.cp0] << 1 | y], T[this.cp1] = ST[T[this.cp1] << 1 | y],
      T[this.cp2] = ST[T[this.cp2] << 1 | y], T[this.cp3] = ST[T[this.cp3] << 1 | y],
      T[this.cp4] = ST[T[this.cp4] << 1 | y], T[this.cp5] = ST[T[this.cp5] << 1 | y],
      MixUp(m, y);
    if (c > 255)
      i = this.c4 = this.c4 << 8 | (c &= 255),
        h[this.bc = 0] = c << 8,
        h[1] = (i & 65535) << 5 | 0x57000000,
        h[2] = (i << 8) * 3,
        h[3] = i * 5,
        h[4] = h[4] * 352 + c * 13 & 0x3fffffff,
        c > 64 && c < 91 && (c += 32),
        c > 96 && c < 123 ? h[5] = (h[5] + c) * 56 : h[5] = 0, i = 65537,
        this.cp1 = this.x(h[c = this.c0 = 1]) + i, this.cp2 = this.x(h[2]) + i,
        this.cp3 = this.x(h[3]) + i, this.cp4 = this.x(h[4]) + i, this.cp5 = this.x(h[5]) + i;
    else if (++this.bc === 4) i = 65537,
      this.cp1 = this.x(h[1] + c) + i, this.cp2 = this.x(h[2] + c) + i,
      this.cp3 = this.x(h[3] + c) + i, this.cp4 = this.x(h[4] + c) + i, this.cp5 = this.x(h[5] + c) + i;
    else this.cp1 += i = y + 1 << (this.bc & 3) - 1, this.cp2 += i, this.cp3 += i, this.cp4 += i, this.cp5 += i;
    this.cp0 = h[0] + c;
    if (i = this.mm.p(y, m)) i = 5 + (i > 7) + (i > 11) + (i > 15) + (i > 31);
    else i = !!T[this.cp4] + !!T[this.cp3] + !!T[this.cp2] + !!T[this.cp1];
    m[1] = s[SMp(sm[0], y, T[this.cp0])], m[2] = s[SMp(sm[1], y, T[this.cp1])],
      m[3] = s[SMp(sm[2], y, T[this.cp2])], m[4] = s[SMp(sm[3], y, T[this.cp3])],
      m[5] = s[SMp(sm[4], y, T[this.cp4])], m[6] = s[SMp(sm[5], y, T[this.cp5])],
      m.cxt = i + 10 * (h[0] >> 13), i = Mixp(m),
      i = i + 3 * SMpp(this.a1, y, i, c) >> 2,
      this.pr = i + 3 * SMpp(this.a2, y, i, c ^ h[0] >> 2) >> 2
  }
};

//////////////////////////// main ////////////////////////
function LPAQ1e(A, m) {
  var a = A.length, b, i, z = a, s, w = 0, x = -1, o = 1, p, O = [m &= 15], P = new Predictor(m);
  for (; a; a >>>= 8)O[o++] = a & 255, O[0] += 16;
  for (; a < z;)for (i = 8, s = A[a++]; i;) {
    p = P.pr; p += p < 2048; m = w + (x - w >>> 12) * p + ((x - w & 4095) * p >> 12);
    P.update(b = s >> --i & 1);
    for (b ? x = m : w = m + 1; !((w ^ x) >> 24); x = x << 8 | 255)
      O[o++] = x >>> 24, w <<= 8
  }
  O[o] = w >>> 24; return O//compressed array
}
function LPAQ1d(A) {
  const timeStart = Date.now();
  for (var a = 1, b = A[0], c, y = A.length, z = 0, m = 0, o = 4, p, v, w = 0, x = b >> 4, O = [], P = new Predictor(b & 15); x--; m += 8)z += A[a++] << m;
  for (; o--;)v = (v << 8 | A[a++]) >>> 0;
  for (; ++o < z; O[o] = c & 255)
    for (c = 1; c < 256; c += c + b) {
      p = P.pr; p += p < 2048; m = w + (x - w >>> 12) * p + ((x - w & 4095) * p >> 12);
      P.update(b = v <= m | 0);
      console.log(`Decompressed from ${z} to ${O.length} bytes in ${Date.now() - timeStart}ms`);
      console.log(`Last decompressed byte: ${c}`);
      for (b ? x = m : w = m + 1; !((w ^ x) >> 24); x = x << 8 | 255)
        v = (v << 8 | (a < y ? A[a++] : 255)) >>> 0, w = w << 8 >>> 0
    }
  return O//decompressed array
}


module.exports = {
  compress: LPAQ1e,
  decompress: LPAQ1d
};
