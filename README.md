# Porter App Create Flow Redesign Task

## Tech Stack

- FastAPI + Python 3.11 (Pydantic, Uvicorn) for the dummy backend
- Next.js, React 19, TypeScript, Tailwind, shadcn/ui + Radix UI, react-hook-form, ESLint, Prettier, etc. etc. for the frontend

## Getting Started

### Prereqs

- Docker / Docker Compose

### Running the Application

To start the application:
```bash
make up
```

This will build and start all services using Docker Compose.

### Available Commands

- `make up` - Builds and starts all services
- `make down` - Stops all running services
- `make logs` - Shows real-time logs from all services
- `make build` - Builds all services without starting
- `make clean` - Removes containers, networks, and volumes

### Research, process, unstructured thoughts

I did a little poking around the Porter app on Wednesday, and tried to essentially pick out things that I thought could be improved on; this sort of helped kick things off for me on Thursday.

In terms of finding inspiration and/or ideas for how people handle multi-step forms for complex apps, I spent some more time on Mobbin, are.na, etc. looking for examples. Onboarding flows are far easier to find - but for most consumer products, onboarding flows are generally quite simple, and rarely involve anything as complex as some of the "advanced" settings we have as part of this workflow. Admittedly, if I had more time, I would've spent more time on this step.

I threw a bunch of ideas into this Figjam board, and tried to spot if there were any patterns worth calling out.

- Step by step validation (this makes forms easier to fill out because you're less likely to go further into a form and mess something up)
- Clear indicators of where you are in a multi step form -- this can be explicit (2 of 4, etc.) or less explicit (using an "active" bar as part of a three part progress bar, for example)
- Progressive disclosure wherever possible (this one's obvious, if you can hide away complexity that doesn't need to be shown, then that's usually a good sign)

Vertical vs horizontal multi-step forms were an interesting comparison to evaluate. Vertical allows you to show as much info and context as possible, given users just scroll up and down, vs horizontal forms where maybe users are forced to click buttons to go back. Vertical forms though are arguably harder to validate.

I also tried sketching out a few ideas that I've thrown into the Figjam board, and landed on an idea that involved trying to use a horizontal multi-step form that still provided context on what users picked in previous steps (this is the third option of the three of my very rough sketches haha)

There are trade-offs with the idea, and obviously the implementation is limited and can be improved on. There's obviously a ton on styling that can be fixed, updated, and tweaked. One _could_ argue that each of these steps are sufficiently independent of each other that having context of what you picked as a user isn't that important.

Ultimately, I think it's a decent idea that could probably use more work and polish. I do like the idea of context being provided as you move through each step, and breaking down the existing workflow to validate at each step, I think the styling for the context row bar thing though could use a little more work!

### Product education

My read of the ask and the context provided was that this was a pretty key piece to incorporate. I've found that while having links out is a decent option, having in-line context is great given users get to stay in the app. There's a ton of flexibility here though, with more time, we could find specifics from the documentation (however outdated it might be!) and then figure out what to link out, what to throw into tooltips, etc. The trade-off here of course is managing two sources of truth, but it's a balancing act. I tested out a few banner components as well to add more context.

### Code quality

I chose to use tailwind and shadcn/ui because I've found Claude Code and LLMs generally do a good job of getting styles close to what I want quicker than if I were to use css modules or a css-in-js option.

That being said, with the limited time I had, the only parts of the codebase that I'm comfortable saying are up to standard are the general scaffolding, the color system, and the updated ui components. There's probably a fair bit that can be improved with state management using the React Profiler, memoization, etc., although one could argue for a dummy project like this really focusing on performance optimization given the time constraints would not be the best use of time.

### Design choices

I decided to start with a few basic colors that Linear has set up given their primary color is similar enough to Porter, and then generated some basic variants for each one. Some of my really rough work for this is documented in this Figma file.

The variants themselves are definitely not perfect and I would take more time to update these using a color model like HCL.

In terms of fonts, I just used Geist and Geist Mono given these are flexible enough and used across a lot of Next projects.

The components themselves could also use some more love in terms of figuring out specific padding, spacing, etc. but I think they do a good enough job for this. Ditto with the various states; I'd like to ideally work on thinking through focus, hover states, etc.

### A list of things I'd have liked to do if I had more time

#### Performance optimizations

A few things I'd have liked to test:

1. Run Lighthouse for performance, accessibility, etc.
2. Test out React Profiler to better manage state and re-renders
3. Memoize / use callbacks wherever it made sense to
4. Lazy loading for non-critical components
5. API response caching where appropriate
6. Form state optimization and better validation -- zod is pretty powerful, the implementation I have here is pretty basic
7. Code splitting, bundle analysis, etc.

#### Other accessibility improvements

1. shadcn/ui components give us a lot out of the box, but we could do more to make this fully navigable via a keyboard
2. Pretty basic but I'd have added in `aria-labels` for all interactive elements
3. Review color contrast and visual accessibility, I usually aim for 4.5:1 (AA)

#### UX polish

1. A lot of the framer motion stuff I've added in here is... okay at best. Sometimes figuring out the right easing curve to use and/or using custom easing curves is where I feel like the real opportunities for polish come in, but there's only so much time!
2. Loading states for all async operations
3. Empty states with helpful messaging
4. Mobile / responsive layout stuff; I'm not sure if people are deploying apps via their phones, but at the very least, I would get to the point where the app looks good at half screen, the sidebar is reactive to viewport width, etc.

#### Error boundaries and fallback user interface components

- Not a lot of error handling set up here
- User-friendly error messages would've been great too!
- Ideally, tests, especially using Playwright, would be great here as well
