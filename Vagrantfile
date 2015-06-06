# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  # config
  project_name = "pedigree"
  project_user = "vagrant"

  # port forwarding
  config.vm.network :forwarded_port, guest: 80, host: 9250
  config.vm.network :forwarded_port, guest: 3000, host: 9251
  config.vm.network :forwarded_port, guest: 7888, host: 9252
  config.vm.network :forwarded_port, guest: 9000, host: 9253
  config.vm.network :forwarded_port, guest: 7474, host: 9254

  # provision
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/main.yml"

    ansible.extra_vars = {
      # general
      project_name: project_name,
      project_user: project_user,
      project_dir: "/vagrant",

      # db
      db_name: project_name,
      db_user: project_user,

      # vagrant specific
      vagrant_env: true,
      ssl_enable: false,
      server_name: 'localhost',
      env: 'dev'
    }
  end
end
