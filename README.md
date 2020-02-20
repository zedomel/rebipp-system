### REBIPP

```npm install```

```npm run build```

### Rodar a aplicação

```docker-compose up```

### Criação de novos arquivos HTMLs

```/lib/view/*.html```

### Criação de novas rotas para arquivos HTMLs

```/lib/routes/view.js```

Template para rotas que o usuário precisa estar autenticado:

```
    router.get('/[PATH]', function(request, response) {
        if (request.session.loggedin) {     
            response.send(render("[HTML_FILE_NAME]", {}))
        } else {                        
            response.redirect('/');
        }
    });
``` 

Template para rotas que o usuário NÃO precisa estar autenticado:

```
    router.get('/[PATH]', function(request, response) {
            response.send(render("[HTML_FILE_NAME]", {}))        
    });
``` 