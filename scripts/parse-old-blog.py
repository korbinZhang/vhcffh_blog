#! /usr/bin/env python3
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2025 frey <frey@wsl>
#
# Distributed under terms of the MIT license.

"""

"""
import os


def parse_meta(meta):
    meta = list(filter(lambda x: x[:5] == 'title' or x[:4] == 'date' or x[:11] == 'description', meta))
    meta = list(map(lambda x: (x.split('=')[0].strip(), x.split('=')[1].strip('" ')), meta))
    meta = {x[0]: x[1] for x in meta}
    return meta


def parse_content(meta, data):
    head = ['---']
    if 'date' in meta:
        head.append(f'date: {meta["date"]}')
    if 'description' in meta:
        head.append(f'description: "{meta["description"]}"')
    head.append('---')
    head.append('')
    head.append(f'# {meta["title"]}')
    head.append('')
    head.append(data)
    return '\n'.join(head)


def get_meta(data):
    meta = data.split('+++')[1].split('\n')
    data = '+++'.join(data.split('+++')[2:])
    meta = parse_meta(meta)
    content = parse_content(meta, data)
    return content


def deal(file):
    d = '/'.join(file.split('/')[:-1])
    old_f = file.split('/')[-1]
    new_f = old_f
    if old_f.split('-')[0].isnumeric():
        new_f = old_f[11:]
    data = ""
    with open(file, 'r') as fp:
        data = fp.read()
        if data[:3] == "+++":
            data = get_meta(data)
            print(new_f)
    if data != "":
        os.remove(f'{d}/{old_f}')
        with open(f'{d}/{new_f}', 'w') as fp:
            fp.write(data)


def main():
    paths = ['../content/blog']
    files = []
    while len(paths) != 0:
        p = paths.pop(0)
        for file in os.listdir(p):
            full_file = os.path.join(p, file)
            if os.path.isdir(full_file):
                paths.append(full_file)
            elif full_file[-3:] == '.md':
                files.append(full_file)
    for file in files:
        deal(file)


if __name__ == "__main__":
    main()
