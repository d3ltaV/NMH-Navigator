import pytest
from main import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def testLoginPageLoads(client):
    response = client.get('/loginpoop')
    assert response.status_code == 200


def testWorkjobsPageLoads(client):
    response = client.get('/workjobs')
    assert response.status_code == 200


def testClassesPageLoads(client):
    response = client.get('/classes')
    assert response.status_code == 200


def testCocurricularsPageLoads(client):
    response = client.get('/cocurriculars')
    assert response.status_code == 200


def testResourcesPageLoads(client):
    response = client.get('/resources')
    assert response.status_code == 200


def testWorkjobsApiReturnsJson(client):
    response = client.get('/api/search?s=workjobs')
    assert response.status_code == 200
    assert response.content_type == 'application/json'


def testClassesApiReturnsJson(client):
    response = client.get('/api/search?s=classes')
    assert response.status_code == 200
    assert response.content_type == 'application/json'


def testCocurricularsApiReturnsJson(client):
    response = client.get('/api/search?s=cocurriculars')
    assert response.status_code == 200
    assert response.content_type == 'application/json'


def testSearchWithQueryWorks(client):
    response = client.get('/api/search?s=workjobs&q=library')
    assert response.status_code == 200


def testInvalidSearchTypeReturnsError(client):
    response = client.get('/api/search?s=invalid')
    assert response.status_code == 400


def testInvalidWorkjobLocationReturns404(client):
    response = client.get('/api/workjobs/poop')
    assert response.status_code == 404