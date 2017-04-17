# Admin. mikrotik hotspot users.

 - soft para habilitar o deshabilitar usuarios hotspot ya creados en routers mikrotik.
 - Realizado en NodeJS 4.5 + AngularJS 1.5.8 + ngMaterial
 # Screenshots
![onpwr3-3](https://cloud.githubusercontent.com/assets/7550822/24327696/62e9ec32-11ae-11e7-9701-834ad8e906dd.png)
![onpwr3-2](https://cloud.githubusercontent.com/assets/7550822/24327697/62ec099a-11ae-11e7-8202-cbe6335b0d8a.png)
![onpwr3-1](https://cloud.githubusercontent.com/assets/7550822/24327698/62fabc2e-11ae-11e7-881b-59a90144301e.png)

## REQUISITOS
- NodeJs 4.5
- RouterOS 6.x

## Como instalar
- Instalar Node.js 4.x.x

- Instalar dependencias con los siguientes comandos:

```
cd node_modules
cd mikronode
npm install
cd ..
cd ..
npm install
```


- Editar config.js con parametros del router, interface con AMARRE IP, y usuario de hotspot que puede administrar el sistema.

Iniciar la aplicación con 
```
npm start
```

Compatible con todos los sistemas operativos

## Características

- Habilitar o deshabilitar a usuarios hotspot ya creados en mikrotik.
- Ver cantidad de dispositivos conectados por cada usuario.
- Cambiar contraseña usuario hotspot.
- Desloguear dispositivos conectados.
- Habilitar o deshabilitar a clientes mediante amarre ARP.
- Modificar Queues/Planes de velocidad asignadas a cada CLiente (determina queue mediante nombre para hotspot, y mediante address para ARP).

## Faltantes (TO-DO):
- Editar maximas conexiones de hotspot.
- Desloguear usuarios activos para el user al deshabilitarlo.
- Otros?.
