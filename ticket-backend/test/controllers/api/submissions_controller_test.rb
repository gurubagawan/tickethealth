require "test_helper"

class Api::SubmissionsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_submissions_create_url
    assert_response :success
  end
end
