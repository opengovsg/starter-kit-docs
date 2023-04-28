# Developing with Codespaces

To ensure a consistent developer experience, we encourage the use of [GitHub Codespaces](https://github.com/features/codespaces), an in-browser coding environment built around Visual Studio Code.

:::note
Developers who are more familiar working on their local machine can adapt the instructions here to suit their own set-ups.
:::

## Step 1: Launch a Codespace

Using your browser, navigate to GitHub repository you have created in the previous section
and select Code > Codespaces.

![Codespaces Tab](./images/codespaces/codespaces-tab.png)

Click or tap on the three dots, and select "New with options...".

![Codespaces - New With Options](./images/codespaces/codespaces-new-with-options.png)

In the following screen, GitHub may prompt you to supply an API key for Postman,
if you have not done so previously. This is to grant the Codespaces you create the
ability to interact with Postman to send emails.

![Codespaces - Create](./images/codespaces/codespaces-create.png)

Wait for the post-create command to finish, and to be presented with a terminal. You will then be presented with Visual Studio Code running in your browser.

![Codespaces - Post Create Command](./images/codespaces/codespaces-post-create-cmd.png)

## Step 2: Start the development server

Verify that your set up is complete by typing `npm run dev` into the terminal,
and wait for your application to be built.

![Codespaces - npm run dev](./images/codespaces/codespaces-npm-run-dev.png)

## Step 3: Access your application

Click the ports tab in the bottom pane. Find port 3000, and click the globe
to Open in Browser.

![Codespaces - Open Port 3000](./images/codespaces/codespaces-open-port-3000.png)

Your application should load, showing the login page. Attempt to log in
by using your email and entering the OTP that subsequently gets sent.

![Starter Kit - Login](./images/codespaces/starter-kit-login.png)

You may have to wait for a while as the next screen gets compiled before
loading. Verify that you have successfully logged in by confirming that
this screen:

![Starter Kit - Dashboard](./images/codespaces/starter-kit-dashboard.png)
