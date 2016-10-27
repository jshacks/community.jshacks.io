#!/bin/bash

##########################
#
# Tasks used for building and runing the application.
#
##########################

TASK=$1
PARAM1=$2
PARAM2=$3
PARAM3=$4

APP_CONTAINER_NAME="jshacks-community"
APP_IMAGE_NAME="jshacks/community"
APP_PORT=8080
GULP_SCRIPT="/app/node_modules/.bin/gulp --gulpfile /app/config/gulpfile.babel.js"
TASKS_SCRIPT="/app/config/tasks.sh"
DIST_PATH=/app/dist/

# Display variables
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
bold=`tput bold`
newline=$'\n'
separator_char="="

#####################
#     HELPERS       #
#####################

# Trim the leading and the trailling whitespace from the
# provided string
# @type helper
# @environment any
# @param string
trim() {
  echo "$(echo -e "${1}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
}

# Echoes a string consisting of a char repeated a number of times
# usage: repeatChar 10 "foo"
# @type helper
# @environment any
# @param number of repetition
# @param character
repeat_char() {
  times=$1
  char=$2
  result=""
  for ((i = 0; i < $times; i++)); do
    result="${result}${char}"
  done
  echo $result
}

# Wraps a text with around special chars
# Makes it easy to distinguish important sections.
# @type helper
# @environment any
# @param string
wrap_text() {
  chars=$(repeat_char 3 $separator_char)
  echo "${chars} ${1} ${chars}"
}

# Repeats an element so that it can hover on top
# or the bottom of the given text
# @type helper
# @environment any
# @param string
separator() {
  text=$1
  len=$(expr length "${text}")
  chars=$(repeat_char $len $separator_char)
  echo $chars
}

# Formats the text and wraps it to be displyed nicely on the screen
# @type helper
# @environment any
# @param string
format_text() {
  text=$1
  text=$(trim "${text}")
  text=$(wrap_text "${text}")

  echo $text
}

# Echos a title formated text that is easily distinguashable
# in the the terminal output
# @type helper
# @environment any
# @param string
title() {
  text=$(format_text "${1}")
  text_separator=$(separator "${text}")

  echo "${text_separator}${newline}${text}${newline}${text_separator}${newline}"
}
# Echos a subtitle formated text that is easily distinguashable
# in the the terminal output
# @type helper
# @environment any
# @param string
subtitle() {
  text=$(format_text "${1}")

  echo "${text}${newline}"
}

# Sets the hosts for the docker container on the local machine
# so that it can be accessed at http://jshacks-community
# @type helper
# @environment local machine
# @param host name
set_host() {
  IP="$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${1})"
  HOST=${1}

  sudo sed -i "/$HOST/ s/.*/$IP\t$HOST/g" /etc/hosts
  sudo grep $HOST /etc/hosts || echo "$IP $HOST" | sudo tee -a /etc/hosts
}

# Stops and removes a container
# @type helper
# @environment any
# @param container name
docker_rm() {
  docker rm -f $1 || :
}

# Tests if a version is <>= than another version
# @url http://stackoverflow.com/questions/4023830/bash-how-compare-two-strings-in-version-format
# @type helper
# @example testvercomp 1.2 1.1 '>' // true
# @param version number
# @param version number
# @param operator
# @return number 0 - false, 1 - true
test_versions () {
  compare_versions $1 $2
  case $? in
    0) op='=';;
    1) op='>';;
    2) op='<';;
  esac
  if [[ $op != $3 ]]
  then
    return 0
  else
    return 1
  fi
}

# Compares to versions and defines the relation between them <, > or =
# @url http://stackoverflow.com/questions/4023830/bash-how-compare-two-strings-in-version-format
# @type helper
# @example testvercomp 1.2 1.1 '>' // true
# @param version number
# @param version number
# @return number
compare_versions () {
  if [[ $1 == $2 ]]
  then
    return 0
  fi
  local IFS=.
  local i ver1=($1) ver2=($2)
  # fill empty fields in ver1 with zeros
  for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
  do
    ver1[i]=0
  done
  for ((i=0; i<${#ver1[@]}; i++))
  do
    if [[ -z ${ver2[i]} ]]
    then
      # fill empty fields in ver2 with zeros
      ver2[i]=0
    fi
    if ((10#${ver1[i]} > 10#${ver2[i]}))
    then
      return 1
    fi
    if ((10#${ver1[i]} < 10#${ver2[i]}))
    then
      return 2
    fi
  done
  return 0
}

# Holds the execution of a script until a port on a given port is opened
# UDP ports are not supported
# @type helper
# @environment any
# @param hostname
# @param port
wait_for_port() {

	host=$(echo "${1}_PORT_${2}_TCP_ADDR" | awk '{print toupper($0)}')
	port=$(echo "${1}_PORT_${2}_TCP_PORT" | awk '{print toupper($0)}')

  printf "Waiting for ${1}:${2} to be available "

	while [ "$(nmap -p ${!port} ${!host} 2>&1 | grep "tcp open")" = "" ]
	do
		printf "."
		sleep 1
	done

}

#####################
# APPLICATION TASKS #
#####################

# Starts the application container and the application server
# @type build
# @environment local machine
application_start() {
  application_stop

  if [ ! -f ./config/private.env ]; then
    echo "Error config/private.env was not found."
    echo "Please create a private.env file based on the config/private.env.tpl file"
    exit 0
  fi

  application_env="APP_ENV=development"

  if [ ! -z "$PARAM1" ]; then
    application_env="APP_ENV=${PARAM1}"
  fi

  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    -p $APP_PORT:8080 \
    -d \
    -e $application_env \
    --env-file ./config/vars.env \
    --env-file ./config/private.env \
    -t \
    --name $APP_CONTAINER_NAME \
    $APP_IMAGE_NAME bash -c "${TASKS_SCRIPT} server_start" > /dev/null

  set_host $APP_CONTAINER_NAME

  subtitle "WARNING! Cross domain requests will be blocked by your browser."
  echo "Run ''' npm run browser ''' to launch \" chromium-browser --disable-web-security \" mode to bypass these issues or"

  docker logs -f $APP_CONTAINER_NAME
}

# Stops and removes the application container
# @type build
# @environment local machine
application_stop() {
  docker rm -f $APP_CONTAINER_NAME > /dev/null || :
}

# Opens the app page in a browser with the disabled CORS settings
# @type build
# @environment local machine
browser_start() {
  chromium-browser --user-data-dir --disable-web-security http://$APP_CONTAINER_NAME:$APP_PORT &
}

# Starts the application server
# It will use webpack dev server or the production server
# depending on the APP_ENV variable or the default
# one set in /app/conf/docker.env
# @type build
# @environment container
server_start() {
  export NODE_ENV=$APP_ENV
  export BASE_PATH=$APP_BASE_PATH
  export BASE_URL=$BASE_URL

  echo '----- BASE URL '
  echo $BASE_URL

  case $NODE_ENV in
    development)
      gulp_start "start:development"
      ;;
    production)
      gulp_start "start:production"
      ;;
    test)
      gulp_start "start:test"
      ;;
    *)
      echo "NODE_ENV must be one of the following: {development|production|test}"
      exit 1
  esac
}

# Tests if dependencies are met and informs the user if any action
# needs to be undertaken
# @type build
# @environment local machine
test_dependencies() {
  deps=(
    "npm:2"
    "node:4"
    "docker:1.8"
  )

  pass=1

  subtitle "Dependencies:"

  for dep in "${deps[@]}" ; do
    name=${dep%%:*}
    min_version=${dep#*:}
    current_version=$($name -v | grep -oP "(\d\.\d?\.?\d?\.?)")

    test_versions $min_version $current_version "<"
    result=$?
    text="${name} @${min_version} - current version ${current_version}"

    if [ $result -eq 1 ]; then
      echo "${green}${text}${reset}"
    else
      echo "${red}${text}${reset}"
      pass=0
    fi
  done

  echo ""
  echo "${bold}[NPM/Node]${reset} instalation and update guide http://blog.npmjs.org/post/85484771375/how-to-install-npm"
  echo "${bold}[Docker]${reset} installation and update guide https://docs.docker.com/engine/installation/"
  echo ""

  return $pass
}

# Preinstall hook triggered before npm install is executed
# @type build
# @environment local machine
preinstall() {

  test_dependencies
  if [ $? -eq 0 ]; then
    subtitle "Instalation aborted. Please resolve dependencies issues above."
    exit 64
  fi

  docker_build
}

# Builds the docker file
# @type build
# @environment local machine
docker_build() {
  docker build \
    -f config/Dockerfile \
    -t \
    $APP_IMAGE_NAME .
}

# Buils the application 
# Outputs both the client and server code to the
# distribution folder
# @type build
# @environment local machine
application_build() {
  docker_build
  application_execute "${GULP_SCRIPT} build"

  separator "Build process finished. See \"${DIST_PATH}\"."
}

# Execute a one off command in the application container
# @type build
# @environment local machine
# @param bash command string
application_execute() {
  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    --env-file ./config/vars.env \
    -e APP_ENV \
    -t \
    --rm \
    $APP_IMAGE_NAME bash -c "${1}"
}

# Start a gulp task
# @type build
# @environment container
# @param gulp task name
gulp_start() {
  eval "${GULP_SCRIPT} ${1}"
}

# Run gulp with a given task
# @type build
# @environment local machine
gulp() {
  application_execute "${GULP_SCRIPT} ${PARAM1}"
}


# ------ RUN TASK ------
title "Running task ${TASK} ${PARAM1} ${PARAM2} ${PARAM3}"
$TASK $PARAM1 $PARAM2 $PARAM3
