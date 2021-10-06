import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import { commentPost } from '../../actions/posts';
import useStyles from './styles';

import socketIOClient from 'socket.io-client';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

    let allMessages = [];
const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const classes = useStyles();
  const commentsRef = useRef();
  const [socket,setSocket]= useState(null);
  const [messages, setMessages] = useState([]);
  const uiCommentsRef = useRef();
  //sk.on('receive-comments', commentSk => {
    //allComments[0]=[...allComments[0],commentSk]
    //console.log(allComments[0])
    // });
  const handleComment =  async (e) => {
  //  sk.emit("send-comments",user?.result?.name+': '+comment);
    await dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id));
    //setComment('');
   // setComments(newComments);
   // console.log(allComments);
   // commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  // e.preventDefault();
  // allComments = [
  //   ...allComments,
  //   user?.result?.name+': '+comment,
  // ];
  // setComments(allComments);
  // setComment('');
  e.preventDefault();
  
    allMessages = [
      ...allMessages,
       user?.result?.name+' '+comment,
    ];
    setMessages(allMessages);
    setComment('');
    setTimeout(() => {
      socket.emit('onMessage', user?.result?.name+' '+comment);
    }, 1000);
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (!socket) {
        const sk = socketIOClient(ENDPOINT);
        setSocket(sk);
        sk.on('message', (data) => {
         
        allMessages = [...allMessages, data];
          setMessages(allMessages);
        });
        
      }
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, socket]);
  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">Comments</Typography>
          {comments?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(': ')[0]}</strong>
              {c.split(':')[1]}
            </Typography>
          ))}
          {messages?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(': ')[0]}</strong>
              {c.split(':')[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        <div style={{ width: '70%' }}>
          <Typography gutterBottom variant="h6">Write a comment</Typography>
          <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          <br />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;