# One Geology


## Dev information

### LOCAL RUN :
Use maven goal : `clean install tomcat7:run`

The maven must run in **Java 8**.

### DOCKER RUN
In the project root folder : `docker-compose up -d`
### FOR USING
The following URLs will be availables :
1. MapViewer : http://localhost:8080/mapClient/
2. H2 manager : http://localhost:8080/mapClient/h2-console/login.jsp
3. Swagger for API : http://localhost:8080/mapClient/swagger-ui.html

## Publication informations
Add following options for specify spring configuration file to use :  
`-Dspring.profiles.active=<active.profile> -Dspring.config.location=<path.to.properties.file>`  
For example :  
`-Dspring.profiles.active=recette -Dspring.config.location=/applications/projets/onegeology.brgm-rec.fr/tomcat/properties/application.yml`

The options are to be put on the command line for the LOCAL RUN.  
For the DOCKER RUN, you must edit the `docker-compose.yml` and add options in the command instruction. The config file must be accessible in the running container.