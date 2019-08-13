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

  	$.ajax({
  		url: this.options.ajax,
  	})
  	.done(res => {
  		res.forEach(item => {
  			this.$select.append(`<option value="${item.id}">${item.name}</option>`)
  		});
  	})
  	.fail(err => {
  		console.log("error");
  		console.dir(err);
  	})
  }
  
}