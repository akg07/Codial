class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();

            let self = this;

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(res){
                let likeCount = parseInt($(self).attr('data-likes'));
                console.log(likeCount);

                if(res.data.deleted == true){
                    likeCount -= 1;
                }else{
                    likeCount += 1;
                }

                $(self).attr('data-likes', likeCount);
                $(self).html(`${likeCount} Likes`);

            })
            .fail(function(errData){
                console.log('AJAX Err: error in completing the req');
            });
        });
    }
}