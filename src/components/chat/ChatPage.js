import React from 'react';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';
import CenterPage from '../common/CenterPage';
import Message from '../../objects/Message';
import Part from '../../objects/Part';
import Category from '../../objects/Category';
import * as chatActions from '../../actions/chatActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import i3Image from '../../../images/i3.jpeg';
import i5Image from '../../../images/i5.jpeg';
import i7Image from '../../../images/i7.jpeg';

import mb1Image from '../../../images/mb1.jpeg';
import mb2Image from '../../../images/mb2.jpeg';
import mb3Image from '../../../images/mb3.jpeg';

import gpu1Image from '../../../images/gpu1.jpeg';
import gpu2Image from '../../../images/gpu2.jpeg';
import gpu3Image from '../../../images/gpu3.jpeg';
let parts = [
	new Category("CPU").addPart([
		new Part("i5 Processor", 197.89, i5Image),
		new Part("i7 Processor", 569.00, i7Image),
	]),
	new Category("Motherboard").addPart([
		new Part("Micro ATX Motherboard", 59.99, mb1Image),
		new Part("ATX Motherboard", 109.99, mb2Image),
	]),
	new Category("GPU").addPart([
		new Part("NVIDIA GTX 1060", 489.89, gpu1Image),
		new Part("Radeon RX 570", 636.99, gpu3Image),
	]),
];

export class ChatPage extends React.Component {
	constructor (props, context) {
		super(props, context);
		this.state = {
			id: 5,
			parts:[
				new Part("NVIDIA GTX 1060", 489.89), 
				new Part("i5 Processor", 197.79)
			]
		};
		this.keyPress = this.keyPress.bind(this);
		this.sendOnClick = this.sendOnClick.bind(this);
		this.partsOnClick = this.partsOnClick.bind(this);
		this.addPartToList = this.addPartToList.bind(this);
		this.removeMessage = this.removeMessage.bind(this);
	}
	componentDidUpdate() {
		let chatLog = document.getElementById("chatLog");
		chatLog.scrollTop = chatLog.scrollHeight;
	}

	calculateTotal() {
		let sum = 0;
		for (let i = 0; i < this.state.parts.length; i++) {
			sum += this.state.parts[i].desc;
		}
		return sum.toFixed(2);
	}

	addMessage(message) {
		this.props.actions.addMessage(message);
		/*this.setState(previousState => {
			return {
				messages: [...previousState.messages, message],
				id: previousState.id + 1
			};
		});*/
	}

	sendMessage() {
		let messageBox = document.getElementById("chatTextbox");
		let text = messageBox.value;
		if (text === "") {
			return;
		}
		let msg = new Message(this.props.id, "user", text);
		this.addMessage(msg);
		messageBox.value = "";
	}

	sendOnClick() {
		this.sendMessage();
	}

	partsOnClick() {
		this.displayParts();
	}

	addPartToList(part) {
		this.setState(previousState => {
			return {
				parts: [...previousState.parts, part]
			};
		});
	}

	displayParts() {
		let chatLog = document.getElementById("chatLog");
		let messageBox = document.getElementById("chatTextbox");
		let text = messageBox.value;
		if (text === "") {
			return;
		}
		for (let j = 0; j < parts.length; j++) {
			let cat = parts[j];
			if (cat.name.toLowerCase() === text.toLowerCase()) {
				let msg = new Message(this.props.id, "user", null, null, cat);
				this.addMessage(msg);
				messageBox.value = "";
				break;
			}
		}
	}
	keyPress(e) {
		let key = e.keyCode;
	
		// If the user has pressed enter
		if (key === 13) {
			if (e.shiftKey) {
				//partsOnClick();
				this.displayParts();
			}
			else {
				this.sendMessage();
			}
			e.preventDefault();
		}
	}

	removeMessage(id) {
		//this.setState(prevState => ({ messages: prevState.messages.filter(msg => msg.id !== id) }));
		this.props.actions.removeMessage(id);
	}

	PartsList(part, ind) {
		return(
			<tr key={ind}>
				<td>{part.name}</td>
				<td>{"$"+part.desc.toFixed(2)}</td>
			</tr>
		);
	}

	render() {
		let messages = this.props.messages;
		return (
			<div className="chatbox">
				<div className="price">
					<table className="price__table">
						<thead>
							<tr>
								<th>Part</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{this.state.parts.map((part, ind)=> (
								this.PartsList(part, ind)
							))}
						</tbody>
						<tfoot>
							<tr>
								<td>Total</td>
								<td>{"$"+this.calculateTotal()}</td>
							</tr>
						</tfoot>
					</table>
				</div>
				<div className="chat__messaging">
					<div id="chatLog" className="chat__log">
						{messages.map((message, ind) => (
							<ChatMessage
								id={message.id}
								owner={message.owner}
								msg={message.message}
								part={message.part}
								cat={message.cat}
								closeFunc={this.removeMessage}
								addFunc={this.addPartToList}
								key={message.id}
							/>
						))}
					</div>
					<div className="chat__input">
						<textarea id="chatTextbox" onKeyDown={this.keyPress} className="chat__textbox" placeholder="Message or Parts..." rows="3" cols="50" />
						<button className="chat__send" onClick={this.sendOnClick}>
							Send
						</button>
						<button className="chat__send" onClick={this.partsOnClick}>
							Parts
						</button>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		messages: state.chat.messages,
		id: state.chat.id
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(chatActions, dispatch)
	};
}

ChatPage.propTypes = {
	messages: PropTypes.array,
	id: PropTypes.number,
	actions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
