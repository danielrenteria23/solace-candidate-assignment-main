### General Approach & Notes

Overall I spent a little bit over 2.5 hours on this. I tried to stick to 2 hours, but I knew I wanted to deploy this and have a live DB too, so went a bit over. Generally, I knew I wanted three big PRs/changes: critical/immediate bugs, redesign, and then optimization w/ testing.

PR 1: This was pretty self explanatory and I tried to make the PR descriptive enough to explain that.

PR 2: "We value design heavily at Solace..." made me happy to read in this task description, as that is where I spent a lot of the time. I knew I wanted to make a great UI, but also address real-world situations too. For example, URL consistency and sharing of URL. In the world of Solace, I would imagine that somebody can reach out to a user and say something like "Hey I know you want an advocate that specializes in LGBTQ matters, so here is a link that shows all of the advocates." I thought this feature was important, as well as, of course, being able to search all fields and filters important fields. The rest is pretty self explanatory in the PR.

PR 3: Where I wish I had more time. Performance is important so I knew I wanted to implement caching and debouncing here. This can be optimized definitely, but only implemented bare functionality to not go over too much time. I also implemented no tests, which I usually use Claude for these days for repetitive unit tests, but wanted to stay within time.

### AI Usage

Just for transparency, I used Claude code for a bit of this:

- Table skeleton creation: Once I designed the table and created loading functionality, I am easily able to ask Claude to create a table skeleton, which does a great job of doing since it has the actual table to reference. Essentially that entire file was created by Claude.
- Accessibility audit: I try my best to always have accessibility in mind, but I always ask Claude to audit my code for accessibility to see if I have missed any obvious ARIA features or focus states and things along those lines. I feel like it does a great job at that as well.
- Unit tests: I did not have time, but if I did, I would have used Claude to implement unit tests with Jest and React Testing Library. Tests are boring but they are important, and I think Claude helps a ton with that.

### If I had More Time

- Multi-select filters
- Pagination or infinite scrolling/lazy loading
- Make the UI look a bit better and more compact on mobile (maybe collapse search and filter section)
- A million other things

Thank you!
