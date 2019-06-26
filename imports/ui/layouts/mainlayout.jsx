import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export const MainLayout = ({title, loginbutton,
						 	content}) => (
	<main className="w-100 h-100">
		<nav className="navbar navbar-light bg-light mb-0">
		{loginbutton}
			<div className="justify-content-center align-self-center m-1">
 				<h5>Abyss Team Builder {title}</h5>
			</div>
		</nav>
		<div className="content pl-2 pr-2">
			{content}
		</div>
		<footer className="footer text-center m-2 p-2">
			<p>Footer Content</p>
		</footer>
     </main>
);