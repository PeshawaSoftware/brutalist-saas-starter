# GitHub Publish Checklist

Use this checklist before you push the repository.

## Repo Setup

- Initialize Git locally if you have not already: `git init`
- Review the repository name you want to use on GitHub
- Add a short GitHub description using the text in `SOCIAL_COPY.md`
- Add repository topics/tags

## Safety Check

- Confirm `.env` does not contain secrets you do not want to expose
- Keep `.env` private and only commit `.env.example`
- Verify `node_modules/` is not committed
- Verify build output folders are not committed unless intentionally needed

## Project Presentation

- Review `README.md`
- Add screenshots or a demo video if possible
- Optionally add a live demo URL to the README
- Decide whether you want to keep roadmap/setup docs public

## Quality Check

- Run `pnpm check`
- Run `pnpm test`
- Run `pnpm format` if needed
- Make sure the app still boots locally with your environment variables

## First Commit Flow

- `git add .`
- `git commit -m "Initial commit"`
- `git branch -M main`
- Create the GitHub repository
- Add the remote
- Push when you are ready

## Recommended Positioning

Describe the repo as a:

- full-stack SaaS starter
- developer boilerplate
- React + Express + tRPC + Drizzle template

Avoid presenting it as a fully completed production SaaS unless you finish the remaining product work first.
