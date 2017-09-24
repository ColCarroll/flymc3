import unittest

import flymc3


class TestFlymc3(unittest.TestCase):

    def setUp(self):
        self.app = flymc3.app.test_client()

    def test_index(self):
        rv = self.app.get('/')
        self.assertIn('Welcome to flymc3', rv.data.decode())


if __name__ == '__main__':
    unittest.main()
