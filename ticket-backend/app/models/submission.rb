class Submission < ApplicationRecord
  validates :feeling, presence: true
  validates :stress, presence: true

  encrypts :feeling, :stress, :comments
end
