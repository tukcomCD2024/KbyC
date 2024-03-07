import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

function Post() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function getPost() {
            try {
                const response = await axios.get(`/post/read/${id}`);
                setPost(response.data);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching post:', error);
            }
        }
        getPost();
    }, [id]);

    async function getCommentList() {
        try {
            const response = await axios.get(`/comment/read/${id}`);
            setCommentList(response.data);
        }
        catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    useEffect(() => {
        getCommentList();
    }, [])

    const deletePost = async () => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            await axios.delete(`/post/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            .then(response => {
                console.log(response.data);
                alert('게시글을 삭제했습니다.');
                navigate('/board');
            })
            .catch(error => {
                console.error('에러 발생', error);
                alert('삭제에 실패했습니다.');
            });
        };
    };

    const saveComment = async () => {
        await axios.post('/comment/create', {
            content: comment,
            post_id: id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            setComment('');
            console.log(response.data);
            alert('댓글이 등록되었습니다.');
            getCommentList();
        })
        .catch(error => {
            console.error('에러 발생', error);
            alert('댓글이 등록되지 않았습니다.');
        });
    };

    const deleteComment = async (id) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            await axios.delete(`/comment/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            .then(response => {
                console.log(response.data);
                alert('댓글을 삭제했습니다.');
                getCommentList();
            })
            .catch(error => {
                console.error('에러 발생', error);
                alert('삭제에 실패했습니다.');
            });
        };
    };

    const updateComment = async (id) => {
        await axios.patch(`/comment/update/${id}`, {
            content: editedComment
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            console.log(response.data);
            alert('댓글이 수정되었습니다.');
            getCommentList();
        })
        .catch(error => {
            console.error('에러 발생', error);
            alert('수정에 실패했습니다.');
        })
        setEditingCommentId(null);
        setEditedComment('');
    }

    const startEditingComment = (id, content) => {
        setEditingCommentId(id);
        setEditedComment(content);
    }

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditedComment('');
    };

    return (
        <div>
            {loading ?

            <h2>Loading...</h2> :

            <div>
                <h2>{post.title}</h2>
                <p>{post.writer_name}&nbsp;&nbsp;{post.post_date.replace('T', ' ')}</p>
                <hr/>
                <p style={{whiteSpace: "pre-line"}}>{post.content}</p>
                {localStorage.getItem('email') === post.writer_email &&
                <div>
                    <hr/>
                    <button onClick={() => navigate(`/post/update/${id}`)}>수정</button>&nbsp;&nbsp;
                    <button onClick={deletePost}>삭제</button>
                </div>
                }
                <hr/>
                <p>
                    댓글 {commentList.length}
                </p>
                {commentList.map(comment => (
                    <div key={comment.comment_id}>
                        {comment.writer_name}
                        {editingCommentId === comment.comment_id ?
                        <>
                            <br/>
                            <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)}></textarea>
                            &nbsp;&nbsp;
                            <br/>
                            <button onClick={() => updateComment(comment.comment_id)}>저장</button>&nbsp;&nbsp;
                            <button onClick={cancelEdit}>취소</button>
                            <br/>
                        </> :
                        <p style={{whiteSpace: "pre-line"}}>
                            {comment.content}
                        </p>
                        }
                        {comment.comment_date.replace('T', ' ')}
                        &nbsp;&nbsp;
                        {localStorage.getItem('email') === comment.writer_email &&
                        <>
                            <button onClick={() => startEditingComment(comment.comment_id, comment.content)}>수정</button>&nbsp;&nbsp;
                            <button onClick={() => deleteComment(comment.comment_id)}>삭제</button>
                        </>
                        }
                        <hr/>
                    </div>
                ))}
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <br/>
                <button onClick={saveComment}>등록</button>
            </div>
            }
        </div>
    )
}

export default Post;