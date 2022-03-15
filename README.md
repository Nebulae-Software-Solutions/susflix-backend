# The Multi-source Open Movies API

## What is this?

I'm an API, which stands for Application Programming Interface, and my purpose is to allow programmers to build cool apps like [this netflix clone, and then some](http://#), and allow them to search for info on movies on a comprehensive database created from multiple sources and actively mantained.

## Why am I here?

   Dude who made me is a geek and loves movies a little too much. Also, he is looking for work and wanted something cool to showcase.

## What's it to you?

Well, I'm actually quite useful if you know your way around a RESTful API. You can use me to search for movies, filter and sort the data in several different ways, and get the results in a nice format. Oh! And also create users, log them in/out and save their favorite movies on a postgres database.
I'm built with performance in mind, so you can actually see your search results in real time.

## What can you do right now?

* Search for movies:
    
`/search` is the basic endpoint. You can then pass it some filtering options as query parameters. For example:

    /search?title=the+matrix        // pretty self-explanatory
    /search?year=1995-2022          // every movie from 1995 to 2022
    /search?genre=action            // movies with the action genre
    /search?genre=comedy,animation  // you can pass multiple genres too
    /search?rating=6.5-9.0          // or a range of ratings
    /search?order_by=year           // order by year (or title, rating and runtime)
    /search?sort=asc                // sort results in (asc)ending or (desc)ending order
    
And of course you can use anything and everything at the same time to get some very specific results. For example:

    /search?title=the+matrix&year=1995-2022&genre=action&rating=6.5-9.0&order_by=year&sort=asc&limit=10&page=2
means:

Search for movies with the title "the matrix" from 1995 to 2022, only if their genre is action, with a rating between 6.5 and 9.0, ordered by year from older to newer. Limit the number of movies per page to 10, but you've probably already seen the first batch so now you want the second page

## Anything else?

Of course, but if you're reading this, it means you got here the very next day since this README's creation, and Dude was way too tired to keep on typing. Sorry about that. Come back, though, I'll probably have a little more to say by then...