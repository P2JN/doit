#!/bin/bash
python manage.py flush --no-input
mongo --eval 'db.dropDatabase()' DOIT
