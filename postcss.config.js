module.exports = {
    plugins: [
        require('@fullhuman/postcss-purgecss')({
            content: ['./*.html'],  // analyse tous tes fichiers HTML
            safelist: [
                // Classes ajoutées dynamiquement par JS — à ne jamais supprimer
                'revealed',
                'active',
                'open',
                'scrolled',
                'hidden',
                'visible',
                'animated',
                /^ripple/,
                /^carousel/,
                /^faq/,
            ]
        }),
        require('cssnano')({ preset: 'default' })
    ]
}