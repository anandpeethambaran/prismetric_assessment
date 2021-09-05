module.exports = {
    "host": "localhost",
    "port": 3030,
    "public": "./public/",
    "paginate": {
      "default": 10,
      "max": 50
    },
    "authentication": {
      "entity": "user",
      "service": "users",
      "secret": "PLPwPZyUUKKegU2OFjuvKX+Aq3M=",
      "authStrategies": [
        "jwt",
        "local"
      ],
      "jwtOptions": {
        "header": {
          "typ": "access"
        },
        "audience": "https://yourdomain.com",
        "issuer": "feathers",
        "algorithm": "HS256",
        "expiresIn": "1d"
      },
      "local": {
        "usernameField": "email",
        "passwordField": "password"
      }
    },
    "mongodb": "mongodb://localhost:27017/prismetric_db"
  }
  