Date.prototype.getWeek = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};


Date.prototype.setInterval = function(type, nb) {
	if(type === 'month') {this.setMonth(this.getMonth()+nb);}
	if(type === 'year') {this.setFullYear(this.getFullYear()+nb);}
	if(type === 'week') {this.setDate(this.getDate()+(7*nb));}
}