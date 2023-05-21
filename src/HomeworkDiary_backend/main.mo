import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor HomeworkDiary {
  type Homework = {
    title : Text;
    description : Text;
    dueDate : Time.Time;
    completed : Bool;
  };

  let homeworkDiary : Buffer.Buffer<Homework> = Buffer.Buffer<Homework>(0);

  // Add a new homework task
  public func addHomework(homework : Homework) : async Nat {
    homeworkDiary.add(homework);
    return homeworkDiary.size() - 1;
  };

  // Get a specific homework task by id
  public query func getHomework(id : Nat) : async Result.Result<Homework, Text> {
    switch (homeworkDiary.getOpt(id)) {
      case (null) {
        return #err("Not found");
      };
      case (?Homework) {
        return #ok(Homework);
      };
    };
  };

  // Update a homework task's title, description, and/or due date
  public func updateHomework(id : Nat, homework : Homework) : async Result.Result<(), Text> {
    switch (homeworkDiary.getOpt(id)) {
      case (null) {
        return #err("Not found");
      };
      case (?Homework) {
        homeworkDiary.put(id, homework);
        return #ok(());
      };
    };
  };

  // Mark a homework task as completed
  public func markAsCompleted(id : Nat) : async Result.Result<(), Text> {
    switch (homeworkDiary.getOpt(id)) {
      case (null) {
        return #err("Not found");
      };
      case (?Homework) {
        let completedHomework : Homework = {
          title = Homework.title;
          description = Homework.description;
          dueDate = Homework.dueDate;
          completed = true;
        };
        homeworkDiary.put(id, completedHomework);
        return #ok(());
      };
    };
  };

  // Delete a homework task by id
  public func deleteHomework(id : Nat) : async Result.Result<(), Text> {
    switch (homeworkDiary.getOpt(id)) {
      case (null) {
        return #err("Not found");
      };
      case (?Homework) {
        let _ = homeworkDiary.remove(id);
        return #ok(());
      };
    };
  };

  // Get the list of all homework tasks
  public query func getAllHomework() : async [Homework] {
    return Buffer.toArray<Homework>(homeworkDiary);
  };

  // Get the list of pending (not completed) homework tasks
  public query func getPendingHomework() : async [Homework] {
    let notCompletedHomeworks : Buffer.Buffer<Homework> = Buffer.Buffer<Homework>(0);

    for (homework in homeworkDiary.vals()) {
      if (homework.completed == false) {
        notCompletedHomeworks.add(homework);
      };
    };

    if (notCompletedHomeworks.size() == 0) {
      return [];
    };
    return Buffer.toArray<Homework>(notCompletedHomeworks);
  };

  // Search for homework tasks based on a search terms
  public query func searchHomework(searchTerm : Text) : async [Homework] {
    let searchedHomeworks : Buffer.Buffer<Homework> = Buffer.Buffer<Homework>(0);
    let pattern : Text.Pattern = #text searchTerm;

    for (homework in homeworkDiary.vals()) {
      if (Text.contains(homework.title, pattern)) {
        searchedHomeworks.add(homework);
      } else if (Text.contains(homework.description, pattern)) {
        searchedHomeworks.add(homework);
      };
    };

    if (searchedHomeworks.size() == 0) {
      return [];
    };
    return Buffer.toArray<Homework>(searchedHomeworks);
  };
};
