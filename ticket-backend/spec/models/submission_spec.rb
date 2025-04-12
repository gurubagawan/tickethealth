require 'rails_helper'

RSpec.describe Submission, type: :model do
  it "is valid with feeling, stress, and comments" do
    submission = Submission.new(feeling: "happy", stress: "low", comments: "Doing great")
    expect(submission).to be_valid
  end

  it "is invalid without a feeling" do
    submission = Submission.new(feeling: nil, stress: "low", comments: "meh")
    expect(submission).to_not be_valid
  end

  it "is invalid without a stress level" do
    submission = Submission.new(feeling: "happy", stress: nil, comments: "meh")
    expect(submission).to_not be_valid
  end
  it "is valid without comments" do
    submission = Submission.new(feeling: "happy", stress: "low", comments: nil)
    expect(submission).to be_valid
  end
end
