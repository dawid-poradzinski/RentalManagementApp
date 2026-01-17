# CURRENT VERSION: 1.3

### [1.3]
`Finished working on JWT token. Decided to stay with httponly cookies and not sending them via header. Added auth controller for register and login`

### [1.2]
`Started working on authorization and authentication. Backend seems to be working by my frontend because of SPA doesn't work. Will look for this later`

### [1.1]
`Extended schema for retrieving data from rentals and closing them. Added field place for rental to database and updated backend to achieve this`

### [1.0]
`Working add maintenance, add item, find items, get item, find maintenances, find maintenances for id, get maintenance. Filter list for items and maintenance find with pagination. Still need to create delete and update functions. Errors are working and loading screens. Worker works without any logging (not implemented yet). Renamed error models for clarification with tsx error generator`

### [0.10]
`Add new fields to item and change them to diffrent sql table so we can get them`

### [0.9]
`Create basic item and maintenance frontend with connection to backend`

### [0.8]
`Update item schema to have new fields: place, size. image. Change maintenance entity to have additional properties of item`

### [0.7]
`Add basic github actions workflow and kubernets deployment strategy (not recomended)`

### [0.6]
`Init frontend in react vite using tailwindcss. Update dockerfile to generate static frontend into backend`.

### [0.5]
`Working saving to cache and expire. Working itemCheck to check item availability in specific time window in cache and db. Working itemRefresh to find available items in specific time window.` 

### [0.4]
`Change rental sql structure for futhure rentals. Change schema for rentals. Rewrite rental and shop controllers.`

### [0.3]
`Added groovy for unit tests.`

### [0.2]
`Updated database diagram. Added ModelsGenerator for schema generation. Created basic backend project. Created docker-compose.`

### [0.1]
`Add HLD folder with HLD, rental flow images, database entities images and openapi schema.`