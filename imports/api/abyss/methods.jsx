import { check } 								from 'meteor/check';
import { Meteor } 								from 'meteor/meteor';
import { abyssDB } 								from './abyssDB.jsx';

process.env.HTTP_FORWARDED_COUNT = 1;

Meteor.methods ({
	'abyss.add'(level){
		if (!this.userId) {	
			throw new Meteor.Error('insert not-authorized, Please log in first.');	
		}
		check(level, Number);

		abyssDB.insert({
			level: level,
			teams: {},
		});
	},
	'abyss.team.add'(floornum, hero1, hero2, hero3, hero4, guardian) {
		if (!this.userId) {	
			throw new Meteor.Error('insert not-authorized, Please log in first.');	
		}
		try {
			abyssDB.update( 
				{team: {}}, 
				{
					$setOnInsert: 	{
						team: {
							createdby: Meteor.user().username,
							level: floornum,
							slot1: hero1, 
							slot2: hero2, 
							slot3: hero3, 
							slot4: hero4, 
							guardian: guardian,
							upvotes:[],
							downvotes:[],
							score: 0, 
						}
					}
				}
				,{upsert: true}
			)
		}catch(e){
			throw new Meteor.Error("duplicate-error");
		}
		abyssDB.rawCollection().createIndex({
			"team.slot1" : 1,
			"team.slot2" : 1,
			"team.slot3" : 1,
			"team.slot4" : 1,
			}, 
			{unique: true}
		); 
	}, 
	'vote.team'(teamID, updown){
		let clientIPadr = this.connection.clientAddress;
		let tempTeamUps = abyssDB.find({_id:teamID}).fetch()[0].team.upvotes;
		let tempTeamDowns = abyssDB.find({_id:teamID}).fetch()[0].team.downvotes;
		switch(updown){
			case 'up':
				if (tempTeamUps.includes(clientIPadr)){
					abyssDB.update(teamID, {
						$pull: { 'team.upvotes' : clientIPadr},
						$inc: { 'team.score': -1 }
					});
				} else {
					abyssDB.update(teamID, {
						$push: { 'team.upvotes' : clientIPadr},
						$inc: { 'team.score': 1 }
					});
				}
				if (tempTeamDowns.includes(clientIPadr)){
					abyssDB.update(teamID, {
						$pull: { 'team.downvotes' : clientIPadr},
						$inc: { 'team.score': 1 }
					});
				} // no double voting
				break;
			case 'down':
				if (tempTeamDowns.includes(clientIPadr)){
					abyssDB.update(teamID, {
						$pull: { 'team.downvotes' : clientIPadr},
						$inc: { 'team.score': 1 }
					});
				} else {
					abyssDB.update(teamID, {
						$push: { 'team.downvotes' : clientIPadr},
						$inc: { 'team.score': -1 }
					});
				}
				if (tempTeamUps.includes(clientIPadr)){
					abyssDB.update(teamID, {
						$pull: { 'team.upvotes' : clientIPadr},
						$inc: { 'team.score': -1 }
					});
				} // no double voting
				break;
		}
	},
	'getIp'(){
		return this.connection.clientAddress;
	}
});
