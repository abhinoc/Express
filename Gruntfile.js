module.exports = function(grunt){
  
    // load plugins
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec',
    ].forEach(function(task){
       grunt.loadNpmTasks(task); 
    });
    
    // configure plugins
    
    grunt.initConfig({
        cafemocha: {
            all: { src: 'qa/tests-*.js', options: { ui: 'tdd'}, }
        },
        jshint: {
            app: ['app.js', 'public/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
        },
        exec: {
 
                    dev: {
                        cmd: 'linkcheck http://localhost:3000'
                    },
                    prod: {
                        cmd: 'linkcheck http://localhost:3001'
                    }
             
        },
        
    });
    
    // register tasks
    
    grunt.registerTask('startnode', 'start!', function(port){
        if (arguments.length===0) {
            grunt.log.writeln(this.name + ", no port mentioned");
        }  if ( +port ===3000)  {
            //grunt.task.run('exec');
            grunt.log.writeln(this.name + "running on" +port);
            }
        });

    grunt.registerTask('default', ['cafemocha', 'jshint', 'startnode:3000', 'exec:dev']);
    
};
