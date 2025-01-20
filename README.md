# advance-url-shortner-api
An advanced URL Shortener API built with Node.js, Express, and Mongoose using a MongoDB database. It supports user authentication via Google OAuth, URL shortening with customizable aliases, click tracking with detailed analytics (device, IP, OS), and Redis caching for optimal performance.

# Steps to Set Up
1. # Clone the repository:
    cd advance-url-shortner-api

2. # Install dependencies:
    npm install

3. # Install Doppler CLI:
    curl -Ls https://cli.doppler.com/install.sh | sh

4. # Set up the environment using Doppler:
# Deployed site
    https://advance-url-shortner-api.onrender.com/url/docs/#/Analytics/get_api_analytics_analytic_overall

# Steps to Set Up
# 1. Clone the repository:
    git clone https://github.com/PurushothamaG96/advance-url-shortner-api.git
    cd advance-url-shortner-api

 # 2. Install dependencies:
    npm install

 # 3. Install Doppler CLI:
    curl -Ls https://cli.doppler.com/install.sh | sh

# 4. Set up the environment using Doppler:

    Run the app with Doppler to inject the environment variables:
    npm run dev


# 5. Start the application:
    The application will run on http://localhost:5000.

# 6. Access API documentation:
    Visit Swagger UI to test and explore API endpoints:

    URL: http://localhost:5000/url/docs/#/




# Usage Instructions
    # Authentication
    Register: Create a new user.
    Login: Authenticate with your credentials to get an access token.
    Access token: Use the token in the Authorization header for all authenticated API requests.


Authorization: Bearer <access_token>
Note: The token expires after 1 hour. Re-login to generate a new token.




