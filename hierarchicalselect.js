'use strict';
class TierGroup {

	constructor(el, options) {
		this.element =el;
		this.options =$.extend({
			ajax: 'api/categories_1.json',
			tierSize: 5
		},options);

		this.$container =el;
		this.$tiers =$('<div/>',{class:'Tiers--group row'});
		this.$breadcrumbs =$('<div/>',{class:'Hiera--breadcrumbs my-1'});

		this.group =[];
		this._html();
		this._events();
		this.createTier();
	}        

	_html() {
		this.element.addClass('Hiera--container');
		this.element.append(this.$breadcrumbs);
		this.element.append(this.$tiers);

		this.$controls ={};
		this.$controls.prev =$('<button/>',{text:'Prev',class:'btn btn-info'});
		this.$controls.next =$('<button/>',{text:'Next',class:'btn btn-info'});
		this.$tierControls =$('<div/>',{class:'Tier--controls mt-1 btn-group'});
		this.$tierControls.append(this.$controls.prev);
		this.$tierControls.append(this.$controls.next);
		this.element.append(this.$tierControls);
	}

	_events() {
		this.$controls.next.click(e => {
			e.preventDefault();
			this._slide.call(this,'right');
		});

		this.$controls.prev.click(e => {
			e.preventDefault();
			this._slide.call(this,'left');
		});		
	}

	buildBreadcrumbs() {
		this.$breadcrumbs.html('');
		this.group.forEach(item => {
			let sel =item.$select[0];
			if (sel.selectedIndex === -1) return;
			let selectedText = sel.options[sel.selectedIndex].text;
			this.$breadcrumbs.append('<span class="bg-light border p-1">' +selectedText+'</span>');
		})	
	}

	getTierWith() {
		return this.group[0].$container[0].offsetWidth;
	}

	_slide(direction) {
		let options ={
			containerWidth: this.element[0].offsetWidth,
			tierWidth:this.getTierWith(),
			tiersCount:this.group.length,
			maxTiers:0,
			scrollValue:this.$tiers[0].scrollLeft,
			animate:{},
		}
		options.maxTiers =Math.round(options.containerWidth / options.tierWidth);


		if (direction === 'right') {
			options.scrollValue +=options.tierWidth;
		} else {
			options.scrollValue -=options.tierWidth;
		}

		// console.dir(options);

		if (options.tiersCount >= options.maxTiers) {
			this.$tiers.animate({scrollLeft: options.scrollValue}, 200);
		}

		if (options.tiersCount > options.maxTiers) {
			this.$controls.prev.removeAttr('disabled');
			this.$controls.next.removeAttr('disabled');
		} else {
			this.$controls.prev.attr('disabled',true);
			this.$controls.next.attr('disabled',true);
		}

	}

	createTier() {
		const newTier = this.buildTier();
		this.appendTier(newTier);
		this.group.push(newTier);
		this.buildBreadcrumbs();

		this._slide.call(this,'right');

    }

    newTierOptions() {
    	let options = $.extend({
    		node: this.group.length,
    		// tierSize: 5
    	},this.options);

    	// set last selected value
    	let lastSelectedIndex = this.group.length-1;
    	let lastSelectedTier = this.group[lastSelectedIndex];
    	if (typeof lastSelectedTier === 'object') {
    		options.ajax += '?selected=' +this.group[lastSelectedIndex].$select.val();
    	}
    	
    	return options;
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