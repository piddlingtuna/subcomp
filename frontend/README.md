# Frontend

The frontend uses [React](https://reactjs.org/) with JavaScript (it really should use TypeScript). It has been refactored to use functional components, instead of outdated (but maybe more performant) class components to improve maintainability. It does not use any state management libraries; React hooks suffice.

[React Bootstrap](https://react-bootstrap.github.io/) is used for styling and [Prettier](https://prettier.io/) is used for linting.

Be a good person and run `prettier --write .` in this directory every so often.

## Documentation

If you are new to React, take a look [here](https://reactjs.org/tutorial/tutorial.html).

[See React documentation.](https://reactjs.org/docs/getting-started.html)

[See React Bootstrap](https://react-bootstrap.github.io/components/alerts)

## Architecture

`src/index.js` imports css, including bootstrap, and renders the App with the React Context. It is unlikely you will need to modify this file.

`src/index.css` provides very basic styling, mostly to do with fonts. It is unlikely you will need to modify this file.

`src/App.js` is the root compontent. If adds the routes and initializes objects in the React context via API calls. If you add another page or need to initialize another object in the React context, you will need to modify this file.

`src/Context.js` provides the React context for global state management. It exposes `projects`, `user`, `projectDeadline`, `voteDeadline`, and `waiting` defined below. If you add another object in the React context, you will need to modify `src/App.js` to initialize it.

```
interface Project {
    id: string;
    title: string;
    summary: string;
    repo: string;
    votes: number;
    zids: string[];
    names: string[];
};
type Projects = Project[];
interface User {
    zid: string;
    name: string;
    votes: string[];
    project_id: string;
}
type ProjectDeadline = string;
type VoteDeadline = string;
```

`src/calls.js` implements the API calls to the backend server. If you add another endpoint, you will need to add a function here.

`src/pages/` contains all the pages of the frontend. Try to keep these pages small and add components liberally. If you add a page, you will need to modify `src/App.js` to route to it.

`src/components/` contains all the components of the frontend. Add components liberally.

## Environment variables

A `.env` file must exist in this directory. It must contain:

- `REACT_APP_BASE_URL` = The domain name used to host the backend. When developing locally, this will be localhost with some port. When deploying, you can exclude this entirely.

An example `.env` would look like:

```
REACT_APP_BASE_URL=http://localhost:8000
```

## Available Scripts

Everything below here was written by [Create React App](https://github.com/facebook/create-react-app). It's the spiel you see in every React frontend.

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
