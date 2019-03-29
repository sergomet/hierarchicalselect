'use strict';
class Tier {

  constructor(options) {
  	this.options =options;
  	this.node =this.options.node;
  	this.$container =$('<div/>',{class:'Tier--container col-3'});
    this.$select =$('<select/>', {
    	class:'form-control',
    	size:this.options.tierSize,
    	'data-node': this.options.node 
    });
    this.$container.html(this.$select);
    this.load();
  }
  
  load() {
    axios.get('https://jsonplaceholder.typicode.com/users').then(res => {
      for (let row in res.data) {
        this.$select.append('<option>'+res.data[row].name+'</option>')
      }
    })
  }
  
}