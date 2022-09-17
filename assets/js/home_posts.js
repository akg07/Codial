{
    
    //method to submit the form data for new post using AJAX
    let create_post = function(){
        let newPostForm = $('#new-post-form'); // get it from home.ejs
        
        newPostForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    // console.log(data);
                    $('#post-content').val("");
                    
                    let newPost = newPostDom(data.data.newPost); // create new post dom
                    $('#posts-list-container>ul').prepend(newPost); //get this id from home.ejs and add new post dom
                    
                    deletePost($(' .delete-post-button', newPost)); // add delete link to new post
                    
                    new PostComments(data.data.newPost._id); //call the create comment class
                    new ToggleLike($(' .toggle-like-btn', newPost)); // add new like button to new post

                    // create notification using NOTY library
                    new Noty({
                        theme: 'relax',
                        text: 'Post published',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post in DOM

    let newPostDom = function(post){
        // copy _post.ejs code
        return $(`<li id="post-${post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                        </small>
                        ${post.content}
                        <small>
                            ${post.user.name}
                        </small>

                        <small>
                            <a href="/likes/toggle/?id=${post._id}&type=Post" class="toggle-like-btn" data-likes="<%= post.likes.length %>">
                                ${post.likes.length} Likes
                            </a>
                        </small>
                    </p>
                    <div class="post-comments">
                        <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Add Comment..." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="add comment">
                        </form>
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                                
                            </ul>
                        </div>
                    </div>
                </li>`);
    }

    // method to delete a post fom DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    $(`#post-${data.data.post_id}`).remove();

                    // add notification
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                },
                error: function(err) {
                    console.log(err.responseText);
                }
            });
        });
    }

    /*
        loops over the all existing posts on the page (when the window loads for the first time)
        and call the deletePost method on delete link of each,
        also add the AJAX (using the class we have created) to the delete button of each
    */

    let convertPostToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post id by spliting the id attribute
            let postId = self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    }

    create_post();
    convertPostToAjax();

}