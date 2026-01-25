# About

**Ski Rental App**


    Is a website application that allows to manage multiple rental locations
    around the world with different timezones and currency.
    It allows users to check available items in specific time window
    and rent them paying full price or only 1/3 for reservation.
    For admins it allows to:
    Add, Modify and Check and give information about condition of items.
    Add, Modify and Check maintenances of items.
    Check, `return, pay and close` rentals.
    Check informations about maintenances and rentals for specific item.

# Technology Stack

    REST communication model - OpenApi 3
    Backend - Java, spring-boot and groovy
    Frontend - React, typescript
    Database - Mysql
    User authentication is using JWT HttpOnly cookie

# Flow

### User flow

`Main website`
![main website](/Readme/images/0.png)
`Item refresh`
*First step of rental, for 95% of users. Check only informations from rental to determinate available items*
![item refresh](/Readme/images/1.png)
`Item check`
*Second step of rental. Here, we check again database and cache to check, if someone else want to rent those items*
![item check](/Readme/images/2.png)
`Item check result`
*Show available items and generate shopping token, that is used in shop step. Without it shopping cannot be completed. If someone without this token will check those item in this time window, he will get them as not available. If user wants to add more items and send token, those items will be available
![item check result](/Readme/images/3.png)
`Item shop`
*Rent items with or without login (must specifi buyer information earlier). Check what you want to rent for sure and decide if you pay upfront or only for reservation*
![item shop](/Readme/images/4.png)

### Worker / Admin Flow

`Item worker list`
*Get all items and filter them*
![item worker list](/Readme/images/5.png)

`Single worker item`
*Single item view for worker*
![single worker item](/Readme/images/14.png)

`Add maintenance`
*Allows to add maintenance*
![item maintenace add](/Readme/images/15.png)

`Maintenances worker list`
*List of all maintenances that you can filter*
![maintenances worker list](/Readme/images/6.png)

`Item maintenance worker list`
*List of all maintenances for specific item that you can filter*
![item maintenances worker list](/Readme/images/7.png)

`Rental worker list`
*List of all rentals that you can filter*
![rental worker list](/Readme/images/8.png)

`Rental return`
*Rental firstly get 'returned' so user doesn't pay for more time*
![rental return](/Readme/images/9.png)

`Rental return summary`
*When getting items returned you can add maintenance to each of them*
![rental return summary](/Readme/images/10.png)

`Rental pay`
*After rental new price is calculated based on missing time and damaged maintenances. User must pay before closing rental for good*
![rental pay](/Readme/images/11.png)

`Rental close`
*After everything is paid worker can close rental for good*
![rental close](/Readme/images/12.png)

`Rental was added on return`
![rental maintenance on return](/Readme/images/13.png)

# How to run

## Localy

To build this app localy I used:


    Java 25
    Maven 3.9.11
    Node 24.12.0


*Steps*

    1. Go to ModelsGenerator folder
    2. Run mvn clean compile
    3. Run mysql database and confiure it in Backend/src/../resources/application.properties
    4. Go to Backend folder
    5. Run mvn clean package
    6. Run java -jar .\target\ski_rent_api-0.0.1-SNAPSHOT.jar
    7. Go to Frontend
    8. Run npm install
    9. Run npm run build
    10. Run npm run preview
    11. Go to localhost:5173

## Docker | Podman

To build this up you need

    Docker
    OR
    Podman and Podman-Compose

*Steps*

    1. Run docker-compose up
    2. Go to localhost:8080

## To test backend api go to
`/swagger-ui/index.html`