require 'rails_helper'

RSpec.describe Submission, type: :model do
  it "is valid with a all fields" do
    submission = Submission.new(
      feeling: "Good",
      stress: "3",
      comments: "Feeling fine",
      hashed_email: Digest::SHA256.hexdigest("user@example.com")
    )
    expect(submission).to be_valid
  end


  it "is invalid without a hashed_email" do
    submission = Submission.new(feeling: "Happy", stress: "3", comments: "All good", hashed_email: nil)
    expect(submission).not_to be_valid
    expect(submission.errors[:hashed_email]).to include("can't be blank")
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

  it "is invalid with multiple validation errors" do
    submission = Submission.new(feeling: nil, stress: nil, comments: "test")
    expect(submission).to_not be_valid
    expect(submission.errors.count).to eq(2)
  end
  
  it "allows empty string for comments" do
    submission = Submission.new(feeling: "sad", stress: "high", comments: "")
    expect(submission).to be_valid
  end
  
  it "collects all errors when invalid" do
    submission = Submission.new
    submission.valid?
    expect(submission.errors.full_messages).to include("Feeling can't be blank", "Stress can't be blank")
  end
  
end
