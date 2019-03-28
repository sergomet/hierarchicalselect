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


class TierGroup {

	constructor(el, options) {
		this.element =el;
		this.options =$.extend({
			tierSize:5
		},options);

		this.$container =el;
		this.$tiers =$('<div/>',{class:'Tiers--group row'});
		this.$breadcrumbs =$('<div/>',{class:'Hiera--breadcrumbs my-1'});

		this.group =[];
		this._html();
		this._controls();
		this.createTier();
	}        

	_html() {
		this.element.addClass('Hiera--container');
		this.element.append(this.$breadcrumbs);
		this.element.append(this.$tiers);

		this.$controls ={};
		this.$controls.prev =$('<button/>',{text:'Prev'});
		this.$controls.next =$('<button/>',{text:'Next'});
		this.$tierControls =$('<div/>',{class:'Tier--controls mt-1 text-center'});
		this.$tierControls.append(this.$controls.prev);
		this.$tierControls.append(this.$controls.next);

		this.element.append(this.$tierControls);
	}

	_controls() {
		this.$controls.prev.click(this._prev.bind(this))
	}

	_prev(e) {
		console.dir(this.getTierWith());
		e.preventDefault();
		this.$tiers.stop().animate({scrollLeft:this.getTierWith()}, 200);
	}

	buildBreadcrumbs() {
		this.$breadcrumbs.html('');
		this.group.forEach(item => {
			let val =item.$select.val();
			if (val === null) return;
			this.$breadcrumbs.append('<span class="bg-light border p-1">' +val+'</span>');
		})	
	}

	getTierWith() {
		return this.group[0].$container[0].offsetWidth;
	}

	createTier() {
		const newTier = this.buildTier();
		this.appendTier(newTier);
		this.group.push(newTier);
		this.buildBreadcrumbs();

		let tierWidth =this.getTierWith.call(this);
		let containerWidth =this.element[0].offsetWidth;
		let maxTiers =Math.round(containerWidth / tierWidth);
		let offsetTiers =this.group.length-maxTiers;
		let offsetWidth =offsetTiers*(tierWidth);

		if (this.group.length >= maxTiers ) {
			console.dir(offsetWidth);
			this.$tiers.stop().animate({scrollLeft:offsetWidth}, 200);
		}
    }

    newTierOptions() {
    	return $.extend({
    		node:this.group.length,
    		tierSize: 5
    	},this.options);
    }

    onChangeTier(tier) {
		this.group.forEach(item => {
			if (item.node > tier.node) item.$container.remove();
		})
		this.group =this.group.filter(item => item.node <= tier.node);
		this.createTier.call(this);
    }

	buildTier() {
		let tier =new Tier(this.newTierOptions());
		tier.$select.on('change',this.onChangeTier.bind(this,tier));
		return tier;
    }

	appendTier(tier) {
		this.$tiers.append(tier.$container);
    }

}

if( typeof jQuery !== 'undefined' ) {
	$.fn.HierarchicalSelect = function (options, args) {
		let instance = new TierGroup(this, options);
	};
} else {
	console.error('HierarchicalSelect require jQuery');
}