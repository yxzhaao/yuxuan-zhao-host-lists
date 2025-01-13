# Explore Dynatrace App Development

This Application was bootstrapped with **Dynatrace App Toolkit**, a command line tool to create, develop and deploy apps in the Dynatrace environment.

In this project, I followed the tutorial to walk through the process of creating, developing and deploying a Dynatrace app. The deployed application can be accessed here: https://wml40232.apps.dynatrace.com/ui/apps/my.yuxuan.zhao.host.insights/.

Through this project, I gained experience with the following features:

- Query metrics using **Dynatrace Query Language (DQL)**.

- Visualize metrics data with **Strato design system** components like Meterbar and Sparkline.

- Extend app functionality by sending **intents**.

- Generate **app function** that serves as backend to access external data.

## Create a Dynatrace App

To create a Dynatrace app, we can run:

`npx dt-app@latest create --environment-url https://<environment-id>.apps.dynatrace.com`

Note: Dynatrace also provides a playground with some data for us to discover the functionnality of Dynatrace. To generate a project that

## Query metrics using DQL

Dynatrace Query Language (DQL) is a tool for retrieving and analyzing metrics data from the Dynatrace environment.

To query metrics data, we need grant our app with access to metrics and entities. Add permissions "storage:metrics:read" and "storage:entities:read" in the `app.config.json` file:

### Ingest Data

During the tutorial, I developed the app in the Dynatrace Playground sandbox environment, with pre-loaded data. In practice, it's necessary to deploy Dynatrace on the according platform to achieve monitoring of the application.

## Visualize data with Strato design system

The Strato design system offers multiple out-of-the-box components to visualize time-series data. I used this library to add components in my app:

- Meterbar: To display CPU usage percentages as percentage bars.
- Sparkline: To display CPU usage trends over time.

## Intents

An intent is a message object we define in an app that allows us to exchange the user flow from one app to another. There are three elements invovled when sending intents: source app, target app and AppShell.

When a source app sends an intent, it first sends the request to AppShell, AppShell allows users to select an app from a list of apps, then the AppShell opens the target app and passes the intent as query arguments in the URL.

I learned to use intents to extend functionnality of querying metrics on each single host.

- First, create more queries (such as `getHostAvgCpuQuery`) in the `src/app/queries` that our app will include as the intent payload.
- Then, create a row action in the table and add the `IntentButton` component with the intent payload.

By clicking the button of each row, we can access **Notebook** App and execute queries on specific host.

## Generate App functions

App functions serves as an app's backend. Every TypeScript file in your project's `/api` directory is automatically deployed as an app function and exposed as an API endpoint. Typically we use app functions to access third-party APIs ove the internet.

I explored how to generate an app function to fetch data from external API (https://dt-url.net/status-history).

## Available Commands of Dynatrace App Toolkit

1. Run the app in the development mode:

### `npm run start`

If we edit a component file in `src` and save it, the page will reload when we save changes. We may also see any errors in the console.

2. Build the app for production:

### `npm run build`

3. Deploy the app:

### `npm run deploy`

Builds the app and deploys it to the specified environment in `app.config.json`.

4. Generate a serverless app function:

### `npm run generate:function`

Generates a new serverless function for your app in the `api` folder.

## Additional Notes

### Dynatrace Playground

Dynatrace provides a playground environment with pre-loaded data for experimentation. This is useful for learning and testing features without impacting production systems. However, apps developed in the playground cannot be deployed to this environment.

### Troubleshooting Deployment Issues

When I tried deploying the application, I encountered the error:

Error: Failed to install the app
HTTP: 403 Forbidden

To troubleshoot the potential causes, it's necessary to change the `environmentUrl` to my own environment.

## Conclusion

This sample project was a great opportunity to learn to build metrics monitoring apps in Dynatrace system. I now have a better understanding of:

- Use DQL to query metrics.
- Build visualization of metrics data using Strato Design System and React framework.
- Extend app functionnality wih intents and app functions.
