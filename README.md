# QuickShop

## Brief Overview
I developed this application as I frequently like to pool my shopoing and other errands with others and I needed an easy and interactive way for multiple users to create and modify lists of objects with descriptions and various properties

The application provides aminimalist easy to use dashboard that lists all of your lists and the number of things on them. Each list allows you to add and check off items and modify any properties on the items such as quantity, preferences, and alternatives

## Smart Find
Application constantly learns what your preferences for each items are and fills in the details for you for easy and efficient use. This information is kept within MongoDB and brought up once the item is added once more to a list

## Building and Running 
The application server is easy to build and run. All that is needed is nodeJS and mongoDB to be installed on your computer; then, run the init_server.sh -m [mongo port] -p [server port], and your are good to go!

## Future updates
Most of the framework for this application is already done, and I plan to continue to add things to it such as more custumisation of current list categories, and more importantly an interface to a proprietary amazon skill allowing control of the app through smart home devices
