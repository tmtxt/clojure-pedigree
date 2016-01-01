# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  # config
  project_name = "pedigree"
  project_user = "vagrant"
  web_db_host_port = 5432

  # port forwarding
  config.vm.network :forwarded_port, guest: 9250, host: 9250
  config.vm.network :forwarded_port, guest: 3000, host: 9251
  config.vm.network :forwarded_port, guest: 7888, host: 9252
  # config.vm.network :forwarded_port, guest: 9000, host: 9253
  config.vm.network :forwarded_port, guest: 7474, host: 9254
  config.vm.network :forwarded_port, guest: web_db_host_port, host: 9255

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
  end


  # provision
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/micro.yml"

    ansible.extra_vars = {
      # general
      project_name: project_name,
      project_user: project_user,
      project_dir: "/vagrant",
      web_db_host_port: web_db_host_port
    }
  end
end
