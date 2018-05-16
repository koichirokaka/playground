def loop():
  count = 1
  while True:
    yield count
    count += 1
    if count == 10:
      return 99


def loop2():
  for i in range(1, 11):
    count = 1
    print('----start: {}----'.format(i))
    while True:
      yield i
      i += 1
      count += 1
      if count == 10:
        print('----end: {}----'.format(i))
        break


for i in loop2():
  print(i)
