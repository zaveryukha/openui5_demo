Getting local environment up and running

1. Setup Docker for you platform [(for example Windows)](https://docs.docker.com/engine/installation/windows/).
	During installation please select/deselect this features (In normal case you need only to setup Docker-Tools. Plese read other topics only for you information):
	- Docker-Compose
	- **deselect** Kitematic
	- Git for Windows
2. Create docker folder inside you Document root
3. Start Docker with "Docker Quickstart Terminal" link from you Start menu
4. run commands:
	- `cd docker`
	- `git clone https://github.com/zaveryukha/openui5_demo.git`
	- `cd openui5_demo`
	- `docker-compose up -d`
	- `docker-machine ip` (normally you should see docker IP like this - 192.168.99.100)
5. edit you hosts file (c:\windows\system32\drivers\etc\hosts). Add this line to the hosts file: `192.168.99.100	openui5_demo`
6. Run local application in you web-browser at url: [http://openui5_demo:8083/step_26](http://openui5_demo:8083/step_26)