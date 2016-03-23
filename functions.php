<?php

/**
 * Enqueue JavaScript
 */
function vital_enqueuer() {

    wp_enqueue_script(
        'main',
        get_template_directory_uri() . '/assets/main.js',
        array('jquery'),
        filemtime(get_template_directory() . '/assets/main.js'),
        true
    );

    /**
     * Localize AJAX URL for use in JavaScript
     */
    $site_info = array(
        'ajax_url'        => admin_url('admin-ajax.php')
    );
    wp_localize_script('main', 'SiteInfo', $site_info);


    /**
     * Get total count of Review posts for use in
     * Customer Reviews page infinite scroll
     */
    $count_reviews = wp_count_posts('review');
    $published_reviews = $count_reviews->publish;
    wp_localize_script('main', 'ReviewsInfo', array(
        'count'          => $published_reviews,
        'posts_per_page' => get_option('posts_per_page')
    ));

}

add_action('wp_enqueue_scripts', 'vital_enqueuer');

/**
 * AJAX callback
 */
function vital_ajax_infinite_scroll() {
    $loop           = $_POST['loop'];
    $paged          = $_POST['page_number'];
    $post_type      = $_POST['post_type'];
    $posts_per_page = $_POST['posts_per_page'];

    $posts = new WP_Query( array(
        'post_type' => $post_type,
        'posts_per_page' => $posts_per_page,
        'paged' => $paged
    ));

    include (locate_template($loop));

    exit;
}
add_action('wp_ajax_nopriv_vital_ajax_infinite_scroll', 'vital_ajax_infinite_scroll');
add_action('wp_ajax_vital_ajax_infinite_scroll', 'vital_ajax_infinite_scroll');
