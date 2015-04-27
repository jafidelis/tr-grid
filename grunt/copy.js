module.exports = function ( grunt ) {
  return {
    site: {
      options: {
        processContent: function (content, srcpath) {
          return grunt.template.process(content);
        }
      },
      files: [
        {
          expand: true,
          cwd: 'misc/site/',
          src: '**',
          dest: '<%= dist %>'
        }
      ]
    },
    masks: {
      src: 'lib/trcomponents/**/*.js',
      dest: '<%= dist %>/trcomponents/trcomponents.js'
    },
    maskmoney: {
      src: 'bower_components/jquery-maskmoney/dist/jquery.maskMoney.js',
      dest: '<%= dist %>/release/jquery.maskMoney.js'
    },
    inputmask: {
      src: 'bower_components/jquery.maskedinput/dist/jquery.maskedinput.js',
      dest: '<%= dist %>/release/jquery.maskedinput.js'
    }
  };
};
