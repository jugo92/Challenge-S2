# Challenge-S2

- The first problem of connection to mysql auth part
How to list IP adress  with networkSettings in docker 
`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mysqldb `
