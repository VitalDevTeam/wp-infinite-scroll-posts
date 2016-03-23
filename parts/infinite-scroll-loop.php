<?php if ($posts->have_posts()) : ?>
    <div class="infinite-page">
        <?php while ($posts->have_posts()) : $posts->the_post(); ?>
            <article class="infinite-item">
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                <div><?php the_content(); ?></div>
            </article>
        <?php endwhile; ?>
    </div>
<?php endif; wp_reset_postdata(); ?>
