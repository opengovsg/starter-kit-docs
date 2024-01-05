import NeonSelectProject from "./images/tableplus/neon-select-project.png"
import NeonDashboard from "./images/tableplus/neon-dashboard.png"
import NeonConnectionParameters from "./images/tableplus/neon-connection-parameters.png"

# Connecting to your database

## TablePlus

[TablePlus](https://tableplus.com/) can be used to connect to your Postgres instance to run queries.

### Development cluster

For connecting to your development instance of Postgres, you can use the following configuration:

| Field       | Value       |
| :---------- | :---------- |
| Host/Socket | `localhost` |
| Port        | `5432`      |
| User        | `root`      |
| Password    | `root`      |
| Database    | `app`       |

### Neon cluster

For connecting to your staging or production cluster running on Neon, you will have to first login to your Neon console and select the project.

<img src={NeonSelectProject} width={500} />

Next, select the branch you want to connect to.

<img src={NeonDashboard} width={500} />

Select "Parameters only" using the dropdown at the top left hand corner of the "Connection Details" panel.

<img src={NeonConnectionParameters} width={350} />

Next provide the following values to your TablePlus connection configuration:

| Field       | Value                                                    |
| :---------- | :------------------------------------------------------- |
| Host/Socket | Use the value provided under `PGHOST` on the console     |
| Port        | 5432                                                     |
| User        | Use the value provided under `PGUSER` on the console     |
| Password    | Use the value provided under `PGPASSWORD` on the console |
| Database    | Use the value provided under `PGDATABASE` on the console |
