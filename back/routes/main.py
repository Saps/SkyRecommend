from flask import render_template

def main():
    return render_template('index.html', the_title="Default page for backend")

