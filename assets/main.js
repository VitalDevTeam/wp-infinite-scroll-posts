var infiniteScrollController = (function($) {
    var win, doc, site_footer, post_container, page = 1, loading = false;

    /**
     * Get posts via AJAX callback cc_ajax_infinite_scroll()
     * @param  {string} loop           Path to template part used to render loop. Must be
     *                                 relative to theme directory
     * @param  {string} post_type      Post type to query
     * @param  {int}    page_number    The page number you want to return
     * @param  {int}    posts_per_page (Optional) Number of posts per page. Uses WP default if not set.
     */
    function getInfinitePosts(loop, post_type, page_number, posts_per_page) {

        // Increment our current page
        page++;

        // Set up our AJAX post data
        var args = {
            action: 'vital_ajax_infinite_scroll',
            loop: loop,
            post_type: post_type,
            page_number: page_number
        };

        // If posts_per_page is not given, use the default WordPress setting
        if (typeof posts_per_page !== 'undefined') {
            args.posts_per_page = posts_per_page;
        } else {
            args.posts_per_page = ReviewsInfo.posts_per_page;
        }

        // Get total number of pages
        var total_pages = Math.ceil(ReviewsInfo.count / args.posts_per_page);

        // Don't bother continuing if we've loaded all the pages
        if (page_number > total_pages) {
            return false;
        }

        $.ajax({
            url: SiteInfo.ajax_url,
            type: 'post',
            data: args,
            beforeSend: function() {
                // Set loading = true to prevent this function from running
                // again before it's done.
                loading = true;
            },
            success: function(posts) {
                // Append our markup to our post container
                post_container.append(posts);
            },
            error: function(response) {
                if (window.console) {
                    console.log(response);
                }
            },
            complete: function() {
                // We're done loading, so set loading = false so the
                // function can be run again
                loading = false;
            }

        });

    }

    function onDocumentReady() {
        win            = $(window);
        doc            = $(document);
        post_container = $('#infinite-content');
        site_footer    = $('.site-footer');

        // Load initial posts
        getInfinitePosts('parts/infinite-scroll-loop.php', 'post', page, 4);

        // Get more posts
        win.on('scroll', function() {

            // If we're not currently loading AND we have scrolled to the bottom of the document
            if ((loading === false) && (win.scrollTop() === doc.height() - win.height())) {
                getInfinitePosts('parts/infinite-scroll-loop.php', 'post', page, 4);
            }

        });

    }

    $(onDocumentReady);

})(jQuery);
