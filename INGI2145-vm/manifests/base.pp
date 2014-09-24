#--One-time Executions----

Exec {
          path => "/usr/bin:/usr/sbin:/bin:/usr/local/bin:/usr/local/sbin:/sbin:/bin/sh",
          user => root,
		  #logoutput => true,
}
   
$once_lock = "/var/lock/puppet-once"
 
 exec { 'run-once-commands':
         command => "touch $once_lock",
         creates => $once_lock,
         notify  => [Exec['apt-update'], Exec['install hadoop']],
 }


#--apt-update Triggers-----

exec { "apt-update":
    command => "sudo apt-get update",
    refreshonly => true,
    #subscribe => Exec["update source list"]
}

Exec["apt-update"] -> Package <| |> #This means that an apt-update command has to be triggered before any package is installed

#--Hadoop configuration constants----

$hconfig1 = '<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
<property>
  <name>fs.default.name</name>
  <value>hdfs://localhost:9000</value>
</property>
<property>
  <name>hadoop.tmp.dir</name>
  <value>/usr/local/hadoop/data</value>
</property>
</configuration>'

$hconfig2 = '<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
 
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>'

$hconfig3 = '<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
 
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>3</value>
    </property>
</configuration>'

$hconfig4 = '<?xml version="1.0"?>
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.aux-services.mapreduce_shuffle.class</name>
        <value>org.apache.hadoop.mapred.ShuffleHandler</value>
    </property>
    <property>
        <name>yarn.resourcemanager.resource-tracker.address</name>
        <value>localhost:8025</value>
    </property>
    <property>
        <name>yarn.resourcemanager.scheduler.address</name>
        <value>localhost:8030</value>
    </property>
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>localhost:8050</value>
    </property>
</configuration>'

#--Miscellaneous Execs-----

exec {"set hadoop permissions":
     command => "chown -R vagrant /usr/local/hadoop/",
     user => root,
 	 #require => User["hduser"],
     subscribe => Exec["install hadoop"],
     refreshonly => true,
}

exec {"setup ssh":
     environment => 'HOME=/home/vagrant',
     command => 'ssh-keygen -t rsa -P "" -f /home/vagrant/.ssh/id_rsa.pub && cat /home/vagrant/.ssh/id_rsa.pub | tee /home/vagrant/.ssh/authorized_keys',
     subscribe => Exec["install hadoop"],
	 #require => User["hduser"],
     user => vagrant,
     refreshonly => true,
}

exec {"set hadoop env":
     environment => 'HOME=/home/vagrant',
     command => 'echo "export HADOOP_HOME=/usr/local/hadoop" | tee -a .bashrc && echo "export JAVA_HOME=/usr" | tee -a .bashrc',
     require => Package["default-jdk"],
	 user => vagrant,
     subscribe => Exec["install hadoop"],
     refreshonly => true,
}

exec {"configure hadoop  1":
     command => 'sed -i \'s/${JAVA_HOME}/\/usr/\' /usr/local/hadoop/etc/hadoop/hadoop-env.sh && sed -i \'/^export HADOOP_OPTS/ s/.$/ -Djava.library.path=$HADOOP_PREFIX\/lib"/\' /usr/local/hadoop/etc/hadoop/hadoop-env.sh && echo \'export HADOOP_COMMON_LIB_NATIVE_DIR=${HADOOP_PREFIX}/lib/native\' | tee -a /usr/local/hadoop/etc/hadoop/hadoop-env.sh',
     subscribe => Exec["install hadoop"],
     refreshonly => true,
}

exec {"configure hadoop 2":
      command => 'echo \'export HADOOP_CONF_LIB_NATIVE_DIR=${HADOOP_PREFIX:-"/lib/native"}\' | tee -a /usr/local/hadoop/etc/hadoop/yarn-env.sh && echo \'export HADOOP_OPTS="-Djava.library.path=$HADOOP_PREFIX/lib"\' | tee -a /usr/local/hadoop/etc/hadoop/yarn-env.sh',
      subscribe => Exec["install hadoop"],
      refreshonly => true,
}

exec {"configure hadoop 3":
      command => "echo \'${hconfig1}\' | tee /usr/local/hadoop/etc/hadoop/core-site.xml && echo '${hconfig2}' | tee /usr/local/hadoop/etc/hadoop/mapred-site.xml && echo '${hconfig3}' | tee /usr/local/hadoop/etc/hadoop/hdfs-site.xml && echo '${hconfig4}' | tee /usr/local/hadoop/etc/hadoop/yarn-site.xml",
      subscribe => Exec["install hadoop"],
      refreshonly => true,
}

#--Disabling IPv6 (for Hadoop)---

exec {"disable ipv6":
     command => "echo 'net.ipv6.conf.all.disable_ipv6 = 1' | tee -a /etc/sysctl.conf && echo 'net.ipv6.conf.default.disable_ipv6 = 1' | tee -a /etc/sysctl.conf && echo 'net.ipv6.conf.lo.disable_ipv6 = 1' | tee -a /etc/sysctl.conf && shutdown -r now",
      subscribe => Exec["install hadoop"],
      refreshonly => true,
}

#--Users and Groups---------------

user { "vagrant":
     name => "vagrant",
     ensure => present,
     groups => ["sudo"]	 
}

#user { "hduser":
#  ensure => "present",
#  home => "/home/hduser",
#  name => "hduser",
#  shell => "/bin/bash",
#  managehome => true,
#  groups => 'hadoop',
#  password => sha1('hduser'),
# }
#

#--Hadoop Installation-----------
 
exec { "install hadoop":
    command => "wget http://mirror.ox.ac.uk/sites/rsync.apache.org/hadoop/common/hadoop-2.4.0/hadoop-2.4.0.tar.gz && tar -xzf hadoop-2.4.0.tar.gz && mv hadoop-2.4.0/ /usr/local && cd /usr/local && ln -s hadoop-2.4.0/ hadoop",
    creates => "/usr/local/hadoop",
    require => Package["default-jdk"],
	refreshonly => true,
}

#--Packages----

package { "ubuntu-desktop":
  ensure => present,
  #notify => Exec["restart system"],
  install_options => ['--no-install-recommends'],
}

package { "ssh":
   ensure => present,
}

package { "eclipse":
   ensure => present,
}

package { "awscli":
   ensure => present
}

package { "nodejs":
   ensure => present
}

package { "default-jdk":
   ensure => present,
}