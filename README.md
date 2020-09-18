# QuickShop

## Brief Overview
I developed this application as I frequently like to pool my shopoing and other errands with others and I needed an easy and interactive way for multiple users to create and modify lists of objects with descriptions and various properties. I do not list this smart home skill publically as it is mainly intended for my personal use and certification is not much fun, but I do provide the model in the "Integrating with Alexa" section for anyone who may want to use the functionality.

The application provides a minimalist easy to use dashboard/ voice interface that lists all of your lists and the number of things on them. Each list allows you to add and check off items and modify any properties on the items such as quantity, preferences, and alternatives.

## Smart Find
The application constantly learns what your preferences for each items are and fills in the details for you for easy and efficient use. This information is kept within MongoDB and brought up once the item is added once more to a list

## Building and Running 
The application server is easy to build and run. All that is needed is nodeJS and mongoDB to be installed on your computer; then, run the init_server.sh -m [mongo port] -p [server port], and your are good to go!

### Integrating with alexa
To make integration with alexa easier and obviate the need for extra authentication boilerplate that comes with a https interface, I chose to make this app deployable as an aws lambda. AWS lambdas also have the advantage of being easily set up which reduces the devops overhead needed in getting this application to run with smart home devices. For the time being I will not be publishing this alexa skill publically so I will include the alexa skill configuration JSON here for anyone that may want to test the application out for themselves. After all half the magic of this app comes from being smart home compatible!

```js script
{
    "interactionModel": {
        "languageModel": {
            "invocationName": "quick shop",
            "modelConfiguration": {
                "fallbackIntentSensitivity": {
                    "level": "LOW"
                }
            },
            "intents": [
                {
                    "name": "AMAZON.CancelIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.HelpIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.StopIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.NavigateHomeIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.FallbackIntent",
                    "samples": []
                },
                {
                    "name": "AddItem",
                    "slots": [
                        {
                            "name": "list",
                            "type": "AMAZON.DeviceType"
                        },
                        {
                            "name": "item",
                            "type": "AMAZON.Food"
                        }
                    ],
                    "samples": [
                        "remove {item} from {list} list",
                        "remove {item} from {list}",
                        "add {item} to {list} list",
                        "add {item} to {list}"
                    ]
                }
            ],
            "types": []
        }
    }
}
```

## Future updates
Most of the framework for this application is already done, and I plan to continue to add things to it such as more custumisation of current list categories, and more importantly an interface to a proprietary amazon skill allowing control of the app through smart home devices
