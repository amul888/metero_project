Todos = new Meteor.Collection('todos');

if(Meteor.isClient){
  Meteor.subscribe('todos');
 //Tempalte Helper
 Template.main.helpers({
 	todos: function(){
 		return Todos.find({},{sort:{createdAt: -1}});
 	}
 });

 Template.main.events({
  "submit .new-todo": function(event){
  	var text = event.target.text.value;
  	console.log(text);

  	Meteor.call('addTodo',text);

  	//clear form
  	event.target.text.value='';
  	//prevent submit
  	return false;
  },
   "click .toggle-checked": function(){
   	Meteor.call('setChecked', this._id, !this.checked);
   },
   "click .delete-todo": function(){
   	 if(confirm('are u sure ?')){
   	  Meteor.call('deleteTodo',this._id);
     }
   }
 });
 Accounts.ui.config({
 	passwordSignupFields: "USERNAME_ONLY"
 })
}
Meteor.methods({
	addTodo: function (text){
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');	
		}
		Todos.insert({
  		text:text,
  		createdAt: new Date(),
  		userId: Meteor.userId(),
  		username: Meteor.user().username
  	});
  },
  deleteTodo: function(todoId){
  	Todos.remove(todoId);
  },
  setChecked: function(todoId, setChecked){
  	Todos.update(todoId,{$set:{cheked: setChecked}});
  }
});